import { Manifest } from 'webextension-polyfill'

import path from "node:path";
import url from "node:url";
import { makeDirectory, readTextFile, writeTextFile } from "manaba-plus-lib/dist/async-fs.js";

import postcssConfig from '../postcss.config.js'

/**
 * The directory in which the dev command is run
 */
const rootPath = path.resolve(__dirname, '..')

/**
 * The url to TailwindCSS CDN script
 */
const cdnScriptUrl = 'https://cdn.tailwindcss.com/3.4.1'

/**
 * The regex to extract TailwindCSS config filename
 */
const configRegex = /@config "([^"]+?)"/

/**
 * The TailwindCSS config filename when not specified
 */
const defaultConfigFilename = 'tailwind.config.js'

// Prepare TailwindCSS script.
const cdnResponse = await fetch(cdnScriptUrl)
const tailwindScript = await cdnResponse.text()

// Prepare dist directory.
const distPath = path.resolve(rootPath, 'dist')
await makeDirectory(distPath)

// Get `postcss-add-root-selector` option
const plugin = postcssConfig.plugins['postcss-add-root-selector']
const rootSelector: string = plugin.rootSelector
const rootSelectorInclude: RegExp[] = plugin.include.map(x => new RegExp(x))

/**
 * Get the TailwindCSS config filename bound to the specified CSS file.
 * @param css The relative path to the CSS file
 * @returns The TailwindCSS config filename
 */
const getTailwindCSSConfigFilename = async (css: string) => {
  const cssPath = path.resolve(rootPath, css)
  const cssContent = await readTextFile(cssPath)

  const match = configRegex.exec(cssContent)
  if (match === null) {
    return defaultConfigFilename
  }
  else {
    const configPath = match[1]
    const configFilename = path.basename(configPath)
    return configFilename
  }
}

/**
 * Load TailwindCSS config file.
 * @param configFilename Config filename
 * @returns The config object
 */
const getTailwindCSSConfig = async (configFilename: string) => {
  const configPath = path.resolve(rootPath, configFilename)

  // We need to use file protocol for Windows...
  const configUrl = url.pathToFileURL(configPath).href

  const config = (await import(configUrl)).default
  return config
}

/**
 * Determine if classes will be wrapped in a selector.
 * @param css The relative path to the CSS file
 * @returns True if the CSS file's classes will be wrapped in a selector, otherwise false
 */
const wrappedRootSelector = (css: string) => {
  for (const regex of rootSelectorInclude) {
    if (regex.test(css)) {
      return true
    }
  }
  return false
}

/**
 * Write TailwindCSS script to the specified file in the dist directory.
 * @param css The relative path to the CSS file of manifest content scripts
 * @return The name of installed file
 */
const installTailwindCSSScript = async (css: string) => {
  const configFilename = await getTailwindCSSConfigFilename(css)
  const config = await getTailwindCSSConfig(configFilename)

  const cssIdentifier = css.replaceAll('/', '.')
  const scriptFilename = `${cssIdentifier}.${configFilename}`

  const jsPath = path.resolve(distPath, scriptFilename)
  let jsContent = `
    ${tailwindScript}
    tailwind.config = ${JSON.stringify(config)}
  `

  if (wrappedRootSelector(css)) {
    // Overwrite `textContent` of the style element appended by TailwindCSS to be wrapped with root-selector.
    jsContent = jsContent.replace(
      'document.head.append(xt)),xt.textContent=r',
      'document.head.append(xt)),xt.textContent=`' + rootSelector + ':\\{${r}\\}`'
    )
  }

  await writeTextFile(jsPath, jsContent)

  return scriptFilename
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

  // Add content scripts
  const scripts = manifest.content_scripts
  if (typeof scripts === 'undefined') {
    return manifest
  }

  for (const script of scripts) {
    script.js ??= []
    script.css ??= []

    for (const css of script.css) {
      const scriptFilename = await installTailwindCSSScript(css)

      if (script.js.includes(scriptFilename)) {
        continue
      }
      script.js.push(scriptFilename)
    }
  }

  return manifest
}
