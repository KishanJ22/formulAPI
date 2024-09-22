import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        coverage: {
            provider: "istanbul",
            reporter: ["html", "lcov", "text"],
            include: ["src/**/*.ts"],
            exclude: [
                "src/__mocks__",
                "src/config.ts",
                "src/db.ts",
                "src/index.ts",
            ],
        },
        reporters: process.env.GITHUB_ACTIONS
            ? ["dot", "github-actions"]
            : ["dot"],
    },
});
