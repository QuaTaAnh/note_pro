"use client";

import { NotionEditor } from "@/components/tiptap-templates/notion-like/notion-like-editor";
import { useEffect, useState, Suspense } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface NotionEditorWrapperProps {
  room?: string;
  placeholder?: string;
  className?: string;
  onError?: (error: Error) => void;
  onReady?: () => void;
}

// Loading component
const EditorLoading = ({ className }: { className?: string }) => (
  <div
    className={`w-full h-96 bg-muted/50 rounded-lg flex items-center justify-center ${className}`}
  >
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Loading editor...</p>
    </div>
  </div>
);

// Error component
const EditorError = ({
  error,
  onRetry,
  className,
}: {
  error: Error;
  onRetry: () => void;
  className?: string;
}) => (
  <div
    className={`w-full h-96 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-center ${className}`}
  >
    <div className="flex flex-col items-center gap-3 p-4 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div>
        <h3 className="font-medium text-destructive mb-1">
          Failed to load editor
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{error.message}</p>
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
);

// Main component
export default function NotionEditorWrapper({
  room = "default-room",
  placeholder = "Start writing...",
  className = "",
  onError,
  onReady,
}: NotionEditorWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleError = (err: Error) => {
    setError(err);
    onError?.(err);
  };

  const handleRetry = () => {
    setError(null);
    setRetryKey((prev) => prev + 1);
  };

  const handleReady = () => {
    onReady?.();
  };

  if (!isClient) {
    return <EditorLoading className={className} />;
  }

  if (error) {
    return (
      <EditorError error={error} onRetry={handleRetry} className={className} />
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Suspense fallback={<EditorLoading className={className} />}>
        <NotionEditor key={retryKey} room={room} placeholder={placeholder} />
      </Suspense>
    </div>
  );
}
