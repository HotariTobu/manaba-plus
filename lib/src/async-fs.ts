import fs from 'node:fs'

/**
 * List files under the specific directory asynchronously.
 * @param path The path to the directory
 * @param recursive If search files recursive
 * @returns Directory entries under the directory
 */
export const listFiles = (path: fs.PathLike, recursive = false) => {
  return new Promise<fs.Dirent[]>((resolve, reject) => {
    fs.readdir(path, {
      recursive,
      withFileTypes: true,
    }, (err, files) => {
      if (err === null) {
        resolve(files)
      }
      else {
        reject(err)
      }
    })
  })
}

export const exists = (path: fs.PathLike) => {
  return new Promise<boolean>((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err === null) {
        resolve(true)
      }
      else if (err.code === 'ENOENT') {
        resolve(false)
      }
      else {
        reject(err)
      }
    })
  })
}

/**
 * Make directory(ies) in specific path asynchronously.
 * Do nothing if the directory has already existed.
 * @param path The path to the directory
 * @param recursive If make directories recursive
 */
export const makeDirectory = async (path: fs.PathLike, recursive = false) => {
  if (await exists(path)) {
    return
  }

  await new Promise<void>((resolve, reject) => {
    fs.mkdir(path, {
      recursive,
    }, (err) => {
      if (err === null) {
        resolve()
      }
      else {
        reject(err)
      }
    })
  })
}

/**
 * Read a text file asynchronously.
 * @param path The path to the path
 * @returns The content read from the file
 */
export const readTextFile = (path: fs.PathOrFileDescriptor) => {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => {
      if (err === null) {
        resolve(data)
      }
      else {
        reject(err)
      }
    })
  })
}

/**
 * Write a text file asynchronously.
 * @param path The path to the path
 * @param data The content written to the file
 */
export const writeTextFile = (path: fs.PathOrFileDescriptor, data: string) => {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, data, 'utf-8', (err) => {
      if (err === null) {
        resolve()
      }
      else {
        reject(err)
      }
    })
  })
}
