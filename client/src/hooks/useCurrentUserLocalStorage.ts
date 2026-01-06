'use client';

import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useCurrentUser } from './useCurrentUser';

type Serializer<T> = (value: T) => string;
type Deserializer<T> = (value: string) => T;

type Options<T> =
    | {
          raw: true;
      }
    | {
          raw?: false;
          serializer?: Serializer<T>;
          deserializer?: Deserializer<T>;
      };

export function useCurrentUserLocalStorage<T>(
    key: string,
    initialValue?: T,
    options?: Options<T>
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] {
    const { id } = useCurrentUser();
    const storageKey = useMemo(
        () => (id ? `user_#${id}_${key}` : null),
        [id, key]
    );

    const serialize = useCallback<Serializer<T | undefined>>(
        (value) => {
            if (value === undefined) {
                return '';
            }

            if (options?.raw) {
                return String(value);
            }

            const serializer: Serializer<T> =
                options?.serializer ?? ((item) => JSON.stringify(item));
            return serializer(value);
        },
        [options]
    );

    const deserialize = useCallback<Deserializer<T | undefined>>(
        (value) => {
            if (options?.raw) {
                return value as unknown as T;
            }

            const deserializer: Deserializer<T> =
                options?.deserializer ?? ((item) => JSON.parse(item));
            return deserializer(value);
        },
        [options]
    );

    const readValue = useCallback(() => {
        if (typeof window === 'undefined' || !storageKey) {
            return initialValue;
        }

        try {
            const storedValue = window.localStorage.getItem(storageKey);

            if (storedValue === null) {
                if (initialValue !== undefined) {
                    window.localStorage.setItem(
                        storageKey,
                        serialize(initialValue)
                    );
                }
                return initialValue;
            }

            if (storedValue === '') {
                return undefined;
            }

            return deserialize(storedValue);
        } catch (error) {
            console.warn(
                `Failed to read localStorage key "${storageKey}" for current user:`,
                error
            );
            return initialValue;
        }
    }, [deserialize, initialValue, serialize, storageKey]);

    const initialValueRef = useRef(initialValue);
    useEffect(() => {
        initialValueRef.current = initialValue;
    }, [initialValue]);
    const [storedValue, setStoredValue] = useState<T | undefined>(() =>
        readValue()
    );

    useEffect(() => {
        const nextValue = readValue();
        setStoredValue(nextValue);
    }, [readValue]);

    const setValue: Dispatch<SetStateAction<T | undefined>> = useCallback(
        (value) => {
            if (!storageKey) {
                setStoredValue((prev) =>
                    typeof value === 'function'
                        ? (value as (previous: T | undefined) => T | undefined)(
                              prev
                          )
                        : value
                );
                return;
            }

            setStoredValue((prev) => {
                const newValue =
                    typeof value === 'function'
                        ? (value as (previous: T | undefined) => T | undefined)(
                              prev
                          )
                        : value;

                try {
                    if (typeof window === 'undefined') {
                        return newValue;
                    }

                    if (newValue === undefined) {
                        window.localStorage.removeItem(storageKey);
                    } else {
                        window.localStorage.setItem(
                            storageKey,
                            serialize(newValue)
                        );
                    }
                } catch (error) {
                    console.warn(
                        `Failed to write localStorage key "${storageKey}" for current user:`,
                        error
                    );
                }

                return newValue;
            });
        },
        [serialize, storageKey]
    );

    const remove = useCallback(() => {
        if (typeof window !== 'undefined' && storageKey) {
            window.localStorage.removeItem(storageKey);
        }
        setStoredValue(initialValueRef.current);
    }, [storageKey]);

    return [storedValue, setValue, remove];
}

export type { Options };
