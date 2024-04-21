import { createDynamicStore, createStore } from "@/utils/createStore";
import { ScrapingNodeId } from "./model";

export const [store] = await createStore(import.meta.dirname, {
  downloadDestination: 'manaba',
  downloadLimit: 5,

  downloadOnlyStarred: false as boolean,
  downloadRemoved: false as boolean,

  defaultIgnoredSet: new Set<ScrapingNodeId>()
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  ignoredSet: null as Set<ScrapingNodeId> | null,
})

export const [localStore] = await createStore(import.meta.dirname, {
  excludedSet: new Set<string>(),
  lastDownloadTime: null as number | null,
}, 'local')
