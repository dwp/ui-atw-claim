import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import js from "@eslint/js";
import dwpConfigBase from "@dwp/eslint-config-base";


export default [
    js.configs.recommended,
    {
        files: [ "**/*.{js,cjs}"],
        languageOptions: { sourceType: "commonjs" }
    },
    {
        files: ["eslint.config.mjs", "app/assets/js/time-out.js"],
        languageOptions: { sourceType: "module" }
    },
    {
        languageOptions: {
            ecmaVersion: 2020,
            parserOptions: {},

            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.mocha,
            },
        },

        plugins: {
            dwpConfigBase,
            unicorn,
        },

        rules: {
            "unicorn/filename-case": ["error", {
                case: "kebabCase",
            }],
        },
    },
    {
        ignores: [
            "coverage",
            "static/govuk",
            "**/static/",
            "assets",
            "test/**/*",
            "test/*",
            "spec/*",
            "spec/**/*",
            "**/.*",
        ]
    },
];
