import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
// import react from "@vitejs/plugin-react-swc";
import webExtension from "vite-plugin-web-extension";
import strip from '@rollup/plugin-strip';

import importMeta from "./hooks/rollup-plugin-import.meta.js";
import topLevelAwait from "./hooks/rollup-plugin-top-level-await.js";
import forceFormat from "./hooks/rollup-plugin-force-format.js";

import { getManifest } from "./hooks/manifest.js"
import { injectTailwindCSS } from "./hooks/injectTailwindCSS.js";

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
      transformManifest: injectTailwindCSS,
      skipManifestValidation: true,
      additionalInputs: [
        "src/pages/contents/index.html",
      ],
    }),

    // Remove debug code
    process.env.NODE_ENV === 'production' && strip({
      include: ['**/src/**/*.{ts,tsx}'],
      labels: ['debug']
    }),

    // Make `import.meta` available in content scripts
    importMeta({
      basePath: import.meta.dirname,
      include: ['**/src/**/*.{ts,tsx}']
    }),

    // Change output format iife -> es and wrap output js with async iif to use toplevel await
    forceFormat({
      format: 'es',
    }),
    topLevelAwait({
      include: ['**/src/modifiers/**/index.js']
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    target: 'esnext'
  },
});
