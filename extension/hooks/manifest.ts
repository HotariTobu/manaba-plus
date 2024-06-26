/// <reference types="vite/client" />

import path from "node:path";
import { readTextFile } from 'manaba-plus-lib/dist/async-fs.js'
import { getHosts } from 'manaba-plus-lib/dist/hosts.js'

/**
 * The path to template file of manifest.json
 */
const templatePath = path.resolve(__dirname, '../src/manifest.json')

/**
 * Keys excluded from host object when replacing placeholders in the template
 */
const excludedHostKeys = ['$schema', 'name', 'source', 'tags']

/**
 * Coordinates key-value pairs from object list.
 * Multiple values belong to one key.
 *
 * sample:
 * ```
 * getValueLists([
 *   {
 *     name: 'Tom'
 *     fruit: 'apple'
 *   },
 *   {
 *     name: 'John'
 *     fruit: 'orange'
 *   }
 * ], ['name'])
 * // Return [
 * //   [
 * //     'fruit',
 * //     ['apple', 'orange']
 * //   ]
 * // ]
 * ```
 * @param objList The object list
 * @param excludedKeys Keys excluded
 * @returns The key-value pairs
 */
const getValueLists = (objList: object[], excludedKeys: string[]) => {
  const pairs = new Map()

  for (const obj of objList) {
    for (const key of Object.keys(obj)) {
      // Skip some properties.
      if (excludedKeys.includes(key)) {
        continue
      }

      const valueList = pairs.get(key) ?? []
      const value = obj[key]

      if (typeof value === 'string') {
        valueList.push(value)
      } else if (Array.isArray(value)) {
        valueList.push(...value)
      }

      pairs.set(key, valueList)
    }
  }

  const valueLists = Array.from(pairs.entries())

  return valueLists
}

/**
 * Replace placeholders with values.
 * The placeholders must be between `"`.
 * Multiple values of one key are joined with `,`.
 *
 * sample:
 * ```
 * replaceValues(`
 *   [
 *     "$fruit$"
 *   ]
 * `, [
 *   [
 *     'fruit',
 *     ['apple', 'orange', 'pear', 'grape']
 *   ]
 * ])
 * // Return `
 * //   [
 * //     "apple",
 * //     "orange",
 * //     "pear",
 * //     "grape"
 * //   ]
 * // `
 * ```
 * @param content The string including placeholders
 * @param valueLists The key-value pairs
 * @returns The replaced string
 */
const replaceValues = (content: string, valueLists: [string, string[]][]) => {
  const chars = /(?:[^"]|\\["])/.source

  for (const [key, valueList] of valueLists) {
    const regex = new RegExp(
      `(\\s*?"${chars}*?)\\$${key}\\$(${chars}*?")(\\s*?)`,
      'g',
    )

    content = content.replaceAll(regex, (...args) => {
      const results = valueList.map((value) => args[1] + value + args[2])
      return results.join(',' + args[3])
    })
  }

  return content
}

/**
 * Fix `web_accessible_resources.matches` into the below style.
 *
 * `<scheme>://<host>/*`
 *
 * sample:
 * https://example.org/foo/bar -> https://example.org/*
 * @param content The manifest JSON string
 * @returns The replaced manifest JSON string
 */
const fixWebAccessibleResources = (content: string) => {
  const manifest = JSON.parse(content) as {
    web_accessible_resources?: {
      matches: string[],
    }[],
  }

  const resources = manifest.web_accessible_resources
  if (typeof resources === 'undefined') {
    return content
  }

  for (const resource of resources) {
    const matches = resource.matches
    const newMatches = []

    for (const match of matches) {
      const result = /((?:\*|\w{3,5}):\/\/(?:\*|(?:\*\.)?[^*/]+)\/).*/.exec(match)
      if (result === null) {
        continue
      }

      const newMatch = result[1] + '*'
      newMatches.push(newMatch)
    }

    resource.matches = newMatches
  }

  return JSON.stringify(manifest, null, '  ')
}

export const getManifest = async () => {
  const hosts = await getHosts()
  const valueLists = getValueLists(hosts, excludedHostKeys)

  let content = await readTextFile(templatePath)
  content = replaceValues(content, valueLists)
  content = fixWebAccessibleResources(content)

  const manifest = {
    version: process.env.npm_package_version,
    ...JSON.parse(content),
  }

  return manifest
}
