"use client";

import { useTiptapConfig } from "@/hooks/use-tiptap-config";
import { Badge } from "@/components/tiptap-ui-primitive/badge";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Users,
  Sparkles,
  Loader2,
} from "lucide-react";

interface TiptapStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function TiptapStatus({
  showDetails = false,
  className = "",
}: TiptapStatusProps) {
  const { isReady, hasCollab, hasAi, isLoading, error, retry } =
    useTiptapConfig();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading Tiptap...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertCircle className="h-4 w-4 text-destructive" />
        <span className="text-sm text-destructive">Tiptap Error</span>
        <Button onClick={retry}>
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <span className="text-sm text-amber-600">Tiptap not configured</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CheckCircle className="h-4 w-4 text-green-500" />
      <span className="text-sm text-green-600">Tiptap Ready</span>

      {showDetails && (
        <div className="flex items-center gap-1">
          {hasCollab && (
            <Badge variant="green" className="text-xs flex items-center gap-1">
              <Users className="h-3 w-3" />
              Collab
            </Badge>
          )}
          {hasAi && (
            <Badge
              variant="default"
              className="text-xs flex items-center gap-1"
            >
              <Sparkles className="h-3 w-3" />
              AI
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
