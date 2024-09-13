import path from "path";
import { defineConfig } from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    root: "./src",
    globalSetup: './vitest.globalSetup.mts',
    coverage: {
      provider: "istanbul"
    }
  }
});
