import { defaultPlugins, defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  experimentalParser: true,
  input: "../backend/openapi.json",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./client",
  },
  plugins: [
    ...defaultPlugins,
    "zod",
  ],
});
