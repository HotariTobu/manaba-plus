import { createDynamicStore, createStore } from "@/utils/createStore";

export const [store] = await createStore(import.meta.dirname, {
  downloadOnlyStarred: false,
  downloadRemoved: false,
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  ignoredSet: new Set<string>()
})
