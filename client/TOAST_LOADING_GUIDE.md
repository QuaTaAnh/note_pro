# Toast & Loading Components Guide

This guide explains how to use the Sonner toast notifications and loading components configured with shadcn/ui.

## 🎯 Overview

We've configured:

- **Sonner** - Beautiful toast notifications
- **Loading Components** - Spinners, skeletons, and loading states
- **Custom Hooks** - For managing loading states
- **Theme Integration** - Works with light/dark themes

## 📦 Installed Components

### Toast System

- `sonner` - Toast notification library
- Custom toast utilities in `@/lib/toast`
- ToastProvider integrated in layout

### Loading Components

- `Spinner` - Custom spinner component
- `Loading` - Multi-variant loading component
- `LoadingSkeleton` - Skeleton loading states
- `LoadingDots` - Animated dots
- `PageLoading` - Full page loading
- `ButtonLoading` - Button loading state

## 🚀 Quick Start

### Using Toasts

```tsx
import { showToast, commonToasts } from "@/lib/toast";

// Basic toasts
showToast.success("Operation completed!");
showToast.error("Something went wrong");
showToast.info("New update available");
showToast.warning("Storage almost full");

// With descriptions and custom duration
showToast.success("Data saved", {
  description: "Your changes have been saved successfully",
  duration: 3000,
});

// Loading toast
const loadingToast = showToast.loading("Processing...");
// Later dismiss it
showToast.dismiss(loadingToast);

// Promise toast - automatically handles loading/success/error states
showToast.promise(fetch("/api/data"), {
  loading: "Fetching data...",
  success: "Data loaded successfully!",
  error: "Failed to load data",
});

// Common toasts
commonToasts.saveSuccess();
commonToasts.createSuccess("Note");
commonToasts.networkError();
```

### Using Loading Components

```tsx
import { Loading, Spinner, PageLoading } from "@/components/ui/loading"
import { useLoading } from "@/hooks/use-loading"

// Simple spinner
<Spinner size="lg" />

// Loading with text
<Loading variant="spinner" text="Loading..." />

// Skeleton loading
<Loading variant="skeleton" />

// Loading dots
<Loading variant="dots" size="md" />

// Page loading
<PageLoading />
```

### Using Loading Hooks

```tsx
import { useLoading, useMultipleLoading } from "@/hooks/use-loading";

function MyComponent() {
  const { isLoading, withLoading } = useLoading();

  const handleSave = async () => {
    try {
      await withLoading(async () => {
        // Your async operation
        await saveData();
      });
      showToast.success("Saved!");
    } catch (error) {
      showToast.error("Save failed");
    }
  };

  return (
    <Button onClick={handleSave} disabled={isLoading}>
      {isLoading ? <ButtonLoading>Saving...</ButtonLoading> : "Save"}
    </Button>
  );
}

// Multiple loading states
function MultipleActionsComponent() {
  const loading = useMultipleLoading();

  return (
    <div>
      <Button
        onClick={() => loading.withLoading("save", saveAction)}
        disabled={loading.isLoading("save")}
      >
        {loading.isLoading("save") ? "Saving..." : "Save"}
      </Button>

      <Button
        onClick={() => loading.withLoading("delete", deleteAction)}
        disabled={loading.isLoading("delete")}
      >
        {loading.isLoading("delete") ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
```

## 🎨 Button Loading States

```tsx
import { ButtonLoading } from "@/components/ui/loading";

<Button disabled={isLoading}>
  {isLoading ? <ButtonLoading>Saving...</ButtonLoading> : "Save Changes"}
</Button>;
```

## 🎯 Real-World Examples

### Form Submission with Toast and Loading

```tsx
function FormComponent() {
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = async (data: FormData) => {
    try {
      await withLoading(async () => {
        const response = await fetch("/api/submit", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Submission failed");
        return response.json();
      });

      commonToasts.saveSuccess();
      // Redirect or update UI
    } catch (error) {
      commonToasts.saveError();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <ButtonLoading>Submitting...</ButtonLoading>
        ) : (
          "Submit Form"
        )}
      </Button>
    </form>
  );
}
```

### Data Fetching with Loading States

```tsx
function DataComponent() {
  const [data, setData] = useState(null);
  const { isLoading, withLoading } = useLoading(true); // Start loading

  useEffect(() => {
    withLoading(async () => {
      const response = await fetch("/api/data");
      const result = await response.json();
      setData(result);
    }).catch(() => {
      commonToasts.loadError();
    });
  }, []);

  if (isLoading) {
    return <PageLoading />;
  }

  return <div>{/* render data */}</div>;
}
```

## 📋 Available Toast Types

- `showToast.success(message, options)`
- `showToast.error(message, options)`
- `showToast.info(message, options)`
- `showToast.warning(message, options)`
- `showToast.loading(message, options)`
- `showToast.promise(promise, messages)`
- `showToast.custom(message, options)`
- `showToast.dismiss(toastId)`

## 🎛️ Toast Configuration

The ToastProvider is configured with:

- Theme-aware (follows your app's light/dark theme)
- Position: top-right
- Rich colors enabled
- Close button enabled
- Custom styling with CSS variables

## 🎨 Loading Variants

- `spinner` - Rotating spinner (default)
- `skeleton` - Skeleton placeholder
- `dots` - Animated dots

## 📱 Demo Page

Visit `/demo` to see all components in action with interactive examples.

## 🔧 Customization

### Custom Toast Styling

Modify the ToastProvider in `@/app/providers.tsx`:

```tsx
<Toaster
  theme={theme}
  position="bottom-right" // Change position
  toastOptions={{
    style: {
      background: "hsl(var(--card))",
      // Custom styles
    },
  }}
/>
```

### Custom Loading Component

```tsx
export function CustomLoader() {
  return (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      <span>Processing...</span>
    </div>
  );
}
```

## 🛠️ TypeScript Support

All components and hooks are fully typed with TypeScript for better development experience and type safety.

---

Happy coding! 🚀
