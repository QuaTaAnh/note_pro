"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showToast, commonToasts } from "@/lib/toast";

export function ToastExamples() {
  const handleSuccessToast = () => {
    showToast.success("Operation completed!", {
      description: "Your data has been saved successfully.",
      duration: 3000,
    });
  };

  const handleErrorToast = () => {
    showToast.error("Something went wrong", {
      description: "Please try again or contact support.",
      duration: 5000,
    });
  };

  const handleInfoToast = () => {
    showToast.info("New update available", {
      description: "Version 2.0 is now available for download.",
    });
  };

  const handleWarningToast = () => {
    showToast.warning("Storage almost full", {
      description: "You have used 90% of your storage space.",
    });
  };

  const handleLoadingToast = () => {
    const loadingToast = showToast.loading("Processing your request...");

    // Simulate async operation
    setTimeout(() => {
      showToast.dismiss(loadingToast);
      showToast.success("Request completed!");
    }, 3000);
  };

  const handlePromiseToast = () => {
    const simulateAsync = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve("Success!");
        } else {
          reject(new Error("Failed!"));
        }
      }, 2000);
    });

    showToast.promise(simulateAsync, {
      loading: "Processing...",
      success: "Operation successful!",
      error: "Operation failed!",
    });
  };

  const handleCustomToast = () => {
    showToast.custom("Do you want to continue?", {
      description: "This action cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () => showToast.success("Action confirmed!"),
      },
    });
  };

  const handleCommonToasts = () => {
    commonToasts.saveSuccess();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Toast Examples</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={handleSuccessToast} variant="default">
            Success Toast
          </Button>

          <Button onClick={handleErrorToast} variant="destructive">
            Error Toast
          </Button>

          <Button onClick={handleInfoToast} variant="secondary">
            Info Toast
          </Button>

          <Button onClick={handleWarningToast} variant="outline">
            Warning Toast
          </Button>

          <Button onClick={handleLoadingToast} variant="secondary">
            Loading Toast
          </Button>

          <Button onClick={handlePromiseToast} variant="outline">
            Promise Toast
          </Button>

          <Button onClick={handleCustomToast} variant="secondary">
            Custom Toast
          </Button>

          <Button onClick={handleCommonToasts} variant="default">
            Common Toast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
