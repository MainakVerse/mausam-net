const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");
const { fixupPluginRules } = require("@eslint/compat");
const tseslint = require("typescript-eslint");

const compat = new FlatCompat();

const compatConfig = compat.extends("next/core-web-vitals");

const patchedConfig = compatConfig.map((entry) => {
  if (entry.plugins) {
    for (const [key, plugin] of Object.entries(entry.plugins)) {
      entry.plugins[key] = fixupPluginRules(plugin);
    }
  }
  return entry;
});

module.exports = [
  ...patchedConfig,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      // Add any TypeScript-specific rules here
    },
  },
  {
    ignores: [".next/*", "out/*"],
  },
];
