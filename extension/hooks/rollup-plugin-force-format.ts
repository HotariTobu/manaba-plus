import { Plugin } from "vite"

type InternalModuleFormat = 'amd' | 'cjs' | 'es' | 'iife' | 'system' | 'umd';
type ModuleFormat = InternalModuleFormat | 'commonjs' | 'esm' | 'module' | 'systemjs';

/**
 * Change the module format of all entries.
 */
const forceFormat = (options?: {
  format?: ModuleFormat
}): Plugin => {
  return {
    name: 'force-format',
    enforce: 'pre',

    outputOptions(outputOptions) {
      return {
        ...outputOptions,
        format: options.format,
      }
    },
  }
}

export default forceFormat
