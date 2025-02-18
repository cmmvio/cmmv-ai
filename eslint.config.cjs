const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const prettier = require("eslint-plugin-prettier");

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
                sourceType: "module"
            }
        },
        files: ["src/**/*.ts", "apps/**/*.ts", "libs/**/*.ts", "test/**/*.ts"],
        ignores: ["node_modules", "dist", "build", ".generated", "eslint.config.js"],
        plugins: {
            "@typescript-eslint": tseslint,
            prettier
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...prettier.configs.recommended.rules,
            "@typescript-eslint/interface-name-prefix": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off"
        },
        settings: {
            env: {
                node: true,
                jest: true
            }
        }
    }
];
