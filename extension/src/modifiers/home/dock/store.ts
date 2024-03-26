import { createStore } from "@/utils/createStore";
import type { Layout } from "./types/layout";

export const [store] = await createStore(import.meta.dirname, {
  /** The width of the left panel */
  middle: 10000,

  /** <page node id, position key> Positions of page nodes */
  pageLayout: new Map() as Layout,
})
