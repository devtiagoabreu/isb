import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Alias explícito em vez de vite-tsconfig-paths: o plugin é incompatível com
// o module runner do Vitest 4 ("Unknown method: getBuiltins").
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
  },
});
