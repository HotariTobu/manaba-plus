import { createDynamicStore, createStore } from "@/utils/createStore";
import { Layout } from "../../types/layout";
import { Period } from "./types/period";

export const [store] = await createStore(import.meta.dirname, {
  years: new Set<string>(),
  terms: new Set<string>(),

  /** The selected term in the courses panel */
  term: '',

  /** The selected tab in the courses panel */
  tab: 'cards',

})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** True if the course is starred, otherwise false. By course ids */
  star: false as boolean,

  /** The course's period. By course ids */
  period: new Map() as Period,

  /** The key-value pairs of course ids and course positions. By period keys*/
  courseLayout: new Map() as Layout,
})
