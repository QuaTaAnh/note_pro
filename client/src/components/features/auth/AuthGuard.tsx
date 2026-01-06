'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/lib/routes';
import { AUTHENTICATED, UNAUTHENTICATED } from '@/lib/constants';
import { PageLoading } from '@/components/ui/loading';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { status } = useSession();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (status === UNAUTHENTICATED) {
            router.replace(ROUTES.LOGIN);
            return;
        }

        if (status === AUTHENTICATED) {
            setIsReady(true);
        }
    }, [status, router]);

    return status === 'loading' || !isReady ? <PageLoading /> : <>{children}</>;
}
