import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "istanbul",
            reporter: ["html", "lcov", "text"],
        },
        reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
    },
});
