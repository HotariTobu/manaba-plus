import { Manifest } from 'webextension-polyfill'

import { resolve } from "node:path";
import { makeDirectory, writeTextFile } from "manaba-plus-lib/dist/async-fs.js";

/**
 * The url to TailwindCSS CDN script
 */
const tailwindCSSScriptUrl = 'https://cdn.tailwindcss.com/3.4.1'

/**
 * The relative path to TailwindCSS CDN script file
 */
const tailwindCSSScriptPath = 'tailwindCSS.js'

const tailwindCSSConfig = {
  corePlugins: {
    preflight: false,
  }
}

/**
 * Inject TailwindCSS script to `content_scripts`.
 * This enables developers live coding of styles.
 * Do nothing if the mode is not `development`.
 * @param manifest The manifest object
 * @returns The replaced manifest object
 */
export const injectTailwindCSS = async (manifest: Manifest.WebExtensionManifest) => {
  if (process.env.NODE_ENV !== 'development') {
    return manifest
  }

  console.log('Injecting TailwindCSS...')

  // Install TailwindCSS script
  const response = await fetch(tailwindCSSScriptUrl)
  const distPath = resolve(__dirname, '../dist')

  await makeDirectory(distPath)

  const filePath = resolve(distPath, tailwindCSSScriptPath)
  const script = await response.text()
  const config = JSON.stringify(tailwindCSSConfig)

  await writeTextFile(filePath, `
  ${script}
  tailwind.config = ${config}
  `)

  // Add content scripts
  const scripts = manifest.content_scripts
  if (typeof scripts === 'undefined') {
    return manifest
  }

  for (const script of scripts) {
    script.js ??= []
    if (script.js.includes(tailwindCSSScriptPath)) {
      continue
    }

    script.js.push(tailwindCSSScriptPath)
  }

  return manifest
}
