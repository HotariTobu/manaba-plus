import { createDynamicStore } from "@/utils/createStore";

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  ignoredSet: new Set<string>()
})
