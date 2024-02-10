import path from "node:path";
import { listFiles, readTextFile } from "./async-fs.js";

const hostsPath = path.resolve(import.meta.dirname, '../../hosts',)

export interface Host {
  name: string
  source: string
  tags: string[]

  "manaba-url": string
  "bad-status": string[]
}

export const getHosts = async () => {
  const entries = await listFiles(hostsPath)
  const processList: Promise<string>[] = []

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue
    }

    if (entry.name.startsWith('_')) {
      continue
    }

    const filepath = path.resolve(entry.path, entry.name)
    const process = readTextFile(filepath)
    processList.push(process)
  }

  const jsonList = await Promise.all(processList)
  const hosts = jsonList.map<Host>(json => JSON.parse(json))

  return hosts
}



/**
 * Coordinated key-value pairs from `./hosts/*.json`.
 * Multiple values belong to one key.
 */
// This is not a function because it is called every time Webpack compiles.
// const valueLists = hosts.then(function (hosts) {
//   const pairs = new Map()

//   for (const host of hosts) {
//     for (const key in host) {
//       // Skip some properties.
//       if (['name', 'source', 'tags'].includes(key)) {
//         continue
//       }

//       const valueList = pairs.get(key) ?? []
//       const value = host[key]

//       if (typeof value === 'string') {
//         valueList.push(value)
//       } else {
//         valueList.push(...value)
//       }

//       pairs.set(key, valueList)
//     }
//   }

//   console.log('Hosts:')
//   console.log(pairs)
//   console.log()

//   return Array.from(pairs.entries())
// })

/**
 * Export the host list to `./host-list.md`.
 */
// const exportHostList = async function () {
//   const dirPath = path.resolve('docs/host-list')
//   const filePath = path.resolve('docs/host-list/index.md')

//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath)
//   }

//   const stream = fs.createWriteStream(filePath)

//   stream.on('error', function (error) {
//     console.log(error.message)
//   })

//   for (const host of await hosts) {
//     const name = host.name
//     const source = host.source

//     if (!name || !source) {
//       console.log(host)
//     }

//     stream.write(`- ${name} [->](${source})\n`)
//   }

//   stream.end()
// }

// module.exports = {
//   valueLists,
//   exportHostList,
// }
