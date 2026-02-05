import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      react
    },
    rules: {
      "react/react-in-jsx-scope": "off"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];