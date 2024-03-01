import { createStore } from "@/utils/createStore";
import type { Layout } from "./types/layout";

export const [store] = await createStore(import.meta.dirname, {
  /** The width of the left panel */
  middle: 10000,

  /** The key-value pairs of node ids and node positions*/
  pageLayout: new Map() as Layout,
})
