import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    eslintConfigPrettier,
    {
        ignores: [
            ".eslintrc.js",
            "eslint.config.mjs",
            ".node_modules/",
            ".dist/",
        ],
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-require-imports": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "no-undef": "off",
        },
    },
];
