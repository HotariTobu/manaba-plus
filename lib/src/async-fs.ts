import fs from 'node:fs'

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
