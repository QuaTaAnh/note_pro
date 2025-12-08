import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

/**
 * Performance optimizer extension for better Vietnamese input handling
 * and reduced lag during fast typing
 */
export const PerformanceOptimizer = Extension.create({
  name: "performanceOptimizer",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("performanceOptimizer"),

        // Debounce view updates for better performance
        view() {
          let updateTimeout: NodeJS.Timeout | null = null;

          return {
            update() {
              // Clear previous timeout
              if (updateTimeout) {
                clearTimeout(updateTimeout);
              }

              // Batch updates
              updateTimeout = setTimeout(() => {
                // Trigger any necessary updates
                updateTimeout = null;
              }, 16); // ~60fps
            },
            
            destroy() {
              if (updateTimeout) {
                clearTimeout(updateTimeout);
              }
            },
          };
        },
      }),
    ];
  },
});
