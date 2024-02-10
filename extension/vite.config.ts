import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
// import react from "@vitejs/plugin-react-swc";
import webExtension from "vite-plugin-web-extension";
import strip from '@rollup/plugin-strip';

import topLevelAwait from "./hooks/rollup-plugin-top-level-await.js";
import forceFormat from "./hooks/rollup-plugin-force-format.js";

import { getManifest } from "./hooks/manifest.js"

import path from "node:path";

const browser = process.env.BROWSER || "chrome"

// https://vitejs.dev/config/
export default defineConfig({
  envDir: path.resolve(import.meta.dirname, '..'),
  define: {
    // __BROWSER__: JSON.stringify(browser),
  },
  plugins: [
    react(),
    webExtension({
      browser,
      manifest: getManifest,
    }),
    strip({
      labels: ['debug']
    }),
    forceFormat({
      format: 'es',
    }),
    topLevelAwait({
      include: ['**/src/modifiers/**/*.js']
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
