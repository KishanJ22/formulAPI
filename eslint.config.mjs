import eslint from "@eslint/js";
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from "eslint-config-prettier";
import globals from 'globals';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        rules: {

            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-require-imports": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "no-unused-vars": "off",
        },
    },
    eslintConfigPrettier,
];
