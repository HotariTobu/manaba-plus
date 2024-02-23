import { Plugin, createFilter, FilterPattern } from "vite"
import path, { dirname } from "node:path";

/**
 * Replace `import.meta` properties.
 */
const importMeta = (options: {
  basePath: string
  include: FilterPattern
  exclude?: FilterPattern
}): Plugin => {
  const filter = createFilter(options.include, options.exclude);
  return {
    name: 'import-meta',

    transform(code, id) {
      if (!filter(id)) {
        return
      }

      // Replace `import.meta.dirname` with the actual directory path
      return code.replaceAll('import.meta.dirname', () => {
        // Extract the directory path from the current file's ID
        const dirPath = path.dirname(id)
        const dirname = path.relative(options.basePath, dirPath)
        return `"${dirname.replaceAll('\\', '/')}"`
      });
    },
  }
}

export default importMeta
