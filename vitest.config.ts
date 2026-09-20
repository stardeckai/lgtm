import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { exclude: ["evals/cases/**", "node_modules/**"] },
});
