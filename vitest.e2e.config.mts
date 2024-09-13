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
    root: "./e2e",
    globalSetup: './vitest.globalSetup.mts',
    forceRerunTriggers: [
      './e2e/tests/**/*.html',
      './e2e/tests/**/*.js',
    ],
    watch: false
  }
});
