import { Plugin, createFilter, FilterPattern } from "vite"

/**
 * Wrap the output js with async iif.
 */
const topLevelAwait = (options: {
  include: FilterPattern
  exclude?: FilterPattern
}): Plugin => {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'top-level-await',
    enforce: 'post',

    renderChunk(code, chunk) {
      const id = chunk.fileName;
      if (!filter(id)) {
        return
      }

      return `
      (async () => {
        ${code}
      })()
      `
    },
  }
}

export default topLevelAwait
