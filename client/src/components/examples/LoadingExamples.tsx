"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loading,
  LoadingSkeleton,
  LoadingDots,
  PageLoading,
  ButtonLoading,
} from "@/components/ui/loading";
import { Spinner } from "@/components/ui/spinner";
import { useLoading, useMultipleLoading } from "@/hooks/use-loading";
import { showToast } from "@/lib/toast";

export function LoadingExamples() {
  const [showPageLoading, setShowPageLoading] = useState(false);
  const { isLoading, withLoading } = useLoading();
  const multipleLoading = useMultipleLoading();

  const simulateAsyncOperation = async (duration = 2000) => {
    await new Promise((resolve) => setTimeout(resolve, duration));
    return "Operation completed!";
  };

  const handleWithLoading = async () => {
    try {
      await withLoading(() => simulateAsyncOperation());
      showToast.success("Operation completed successfully");
    } catch {
      showToast.error("Operation failed");
    }
  };

  const handleMultipleLoading = async (key: string) => {
    try {
      await multipleLoading.withLoading(key, () => simulateAsyncOperation());
      showToast.success(`${key} completed!`);
    } catch {
      showToast.error(`${key} failed`);
    }
  };

  const handlePageLoading = () => {
    setShowPageLoading(true);
    setTimeout(() => {
      setShowPageLoading(false);
      showToast.success("Page loaded!");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Spinner Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Spinner Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <Spinner size="sm" />
              <span className="text-xs">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="md" />
              <span className="text-xs">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Spinner size="lg" />
              <span className="text-xs">Large</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Spinner with Text</h4>
            <Loading variant="spinner" text="Loading data..." />
          </div>

          <div>
            <h4 className="font-medium mb-2">Loading Dots</h4>
            <div className="flex gap-4">
              <LoadingDots size="sm" />
              <LoadingDots size="md" />
              <LoadingDots size="lg" />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Skeleton Loading</h4>
            <LoadingSkeleton lines={3} />
          </div>
        </CardContent>
      </Card>

      {/* Loading States with Hooks */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States with Hooks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Single Loading State</h4>
            <Button
              onClick={handleWithLoading}
              disabled={isLoading}
              className="w-40"
            >
              {isLoading ? (
                <ButtonLoading>Loading...</ButtonLoading>
              ) : (
                "Start Operation"
              )}
            </Button>
          </div>

          <div>
            <h4 className="font-medium mb-2">Multiple Loading States</h4>
            <div className="flex gap-4">
              <Button
                onClick={() => handleMultipleLoading("save")}
                disabled={multipleLoading.isLoading("save")}
                className="w-32"
              >
                {multipleLoading.isLoading("save") ? (
                  <ButtonLoading>Saving...</ButtonLoading>
                ) : (
                  "Save"
                )}
              </Button>

              <Button
                onClick={() => handleMultipleLoading("delete")}
                disabled={multipleLoading.isLoading("delete")}
                variant="destructive"
                className="w-32"
              >
                {multipleLoading.isLoading("delete") ? (
                  <ButtonLoading>Deleting...</ButtonLoading>
                ) : (
                  "Delete"
                )}
              </Button>

              <Button
                onClick={() => handleMultipleLoading("export")}
                disabled={multipleLoading.isLoading("export")}
                variant="secondary"
                className="w-32"
              >
                {multipleLoading.isLoading("export") ? (
                  <ButtonLoading>Exporting...</ButtonLoading>
                ) : (
                  "Export"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page Loading */}
      <Card>
        <CardHeader>
          <CardTitle>Page Loading</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handlePageLoading} disabled={showPageLoading}>
            {showPageLoading ? "Loading Page..." : "Simulate Page Load"}
          </Button>

          {showPageLoading && (
            <div className="mt-4">
              <PageLoading />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
