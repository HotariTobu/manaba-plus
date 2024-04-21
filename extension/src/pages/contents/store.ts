import { createDynamicStore, createStore } from "@/utils/createStore";
import { ScrapingNodeId } from "./model";

export const [store] = await createStore(import.meta.dirname, {
  /** Relative path to a directory in which downloaded files will be located */
  downloadDestination: 'manaba',

  /** The max number of synchronous downloading files */
  downloadLimit: 5,


  /** True if download files in starred courses only, otherwise false */
  downloadStarredOnly: false as boolean,

  /** True if download files in hidden courses too, otherwise false */
  downloadHiddenToo: false as boolean,

  /** A set of id to prevent scraping in default */
  defaultIgnoredSet: new Set<ScrapingNodeId>()
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** <course id, scraping node id set> A set of id to prevent scraping */
  ignoredSet: null as Set<ScrapingNodeId> | null,
})

export const [localStore] = await createStore(import.meta.dirname, {
  /** A set of file id to prevent duplicated download */
  excludedSet: new Set<string>(),

  /** The time number in the last download completed, or null if no download has been done */
  lastDownloadTime: null as number | null,
}, 'local')
