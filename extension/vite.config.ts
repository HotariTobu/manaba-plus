import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import react from "@vitejs/plugin-react-swc";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
import path from "node:path";

const browser = process.env.BROWSER || "chrome"

function generateManifest() {
  const template = readJsonFile("src/manifest.json");
  const { version } = readJsonFile("package.json");
  return {
    version,
    ...template,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // __BROWSER__: JSON.stringify(browser),
  },
  plugins: [
    react(),
    webExtension({
      browser,
      manifest: generateManifest,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
