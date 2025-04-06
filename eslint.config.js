import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

/* eslint-env node */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    "rules": {
      "indent": "off",
      "linebreak-style": [
        "error",
        "unix"
      ],
      "quotes": [
        "error",
        "double"
      ],
      "semi": [
        "error",
        "always"
      ]
    }
  }
];