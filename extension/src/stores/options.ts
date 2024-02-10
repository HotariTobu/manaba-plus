import browser from "webextension-polyfill";

import options from './options.json'
import './options.type'

export const o = options
export const sections = new Map<string, OptionSection>()
export const items = new Map<string, OptionItem>()

// Flatten option sections and items.
sections.set('', options)

const sectionStack: [OptionSection] = [options]
while (true) {
  const section = sectionStack.pop()
  if (typeof section === 'undefined') {
    break
  }

  section.isSection = true

  Object.defineProperty(section, 'children', {
    get(): { key: string; node: OptionNode }[] {
      // Anyway skip `title`.
      let skipCount = 1

      // If `dependency` was defined, skip it, too.
      if (typeof section.dependency !== 'undefined') {
        skipCount++
      }

      // Skip the last property to exclude `isSection`.
      // Don't care about 'children' because it is not enumerable as default.
      return Object.entries(section)
        .slice(skipCount, -1)
        .map(([key, node]) => ({ key, node }))
    },
  })

  if (typeof section.children === 'undefined') {
    continue
  }

  for (const { key, node } of section.children) {
    // If `node` is a section...
    if ('title' in node) {
      const subSection = node as OptionSection

      sectionStack.push(subSection)
      sections.set(key, subSection)
    } else {
      node.isSection = false

      const item = node as OptionItem

      if ('value' in item) {
        item._value = item.value
      }

      items.set(key, item)
    }
  }
}

// Get stored values.
const pairs = await browser.storage.sync.get([...items.keys()])

for (const key in pairs) {
  const item = items.get(key)
  if (typeof item === 'undefined') {
    continue
  }

  item._value = pairs[key]
}

// Add setter in items.
for (const [key, item] of items) {
  Object.defineProperty(item, 'value', {
    get() {
      return item._value
    },
    set(value) {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        browser.storage.sync.remove(key)
        return
      }

      if (item._value !== value) {
        item._value = value
        browser.storage.sync.set({ [key]: value })
      }
    },
  })
}
