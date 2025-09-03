import { useCallback, useEffect, useRef } from "react";

export const useAutoResize = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Memoize the resize function to prevent unnecessary re-creation
  const resizeTextarea = useCallback(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    // Use requestAnimationFrame for better performance
    const rafId = requestAnimationFrame(resizeTextarea);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [value, resizeTextarea]);

  return textareaRef;
};