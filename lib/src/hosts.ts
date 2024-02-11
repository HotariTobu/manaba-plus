import fs from "node:path";
import { listFiles, readTextFile } from "./async-fs.js";

const hostsPath = fs.resolve(import.meta.dirname, '../../hosts',)

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

    const filepath = fs.resolve(entry.path, entry.name)
    const process = readTextFile(filepath)
    processList.push(process)
  }

  const jsonList = await Promise.all(processList)
  const hosts = jsonList.map<Host>(json => JSON.parse(json))

  return hosts
}
