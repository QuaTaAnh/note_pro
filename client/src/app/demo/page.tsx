"use client";

import { ToastExamples } from "@/components/examples/ToastExamples";
import { LoadingExamples } from "@/components/examples/LoadingExamples";

export default function DemoPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Toast & Loading Demo</h1>
        <p className="text-muted-foreground">
          Showcase of Sonner toast notifications and loading components using
          shadcn/ui
        </p>
      </div>

      <div className="grid gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Toast Notifications</h2>
          <ToastExamples />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Loading Components</h2>
          <LoadingExamples />
        </div>
      </div>
    </div>
  );
}
