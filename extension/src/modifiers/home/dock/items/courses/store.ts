import { createDynamicStore, createStore } from "@/utils/createStore";
import { Layout } from "../../types/layout";
import { CoordinatesMap } from "./types/coordinate";
import { Term } from "./types/term";

export const [store] = await createStore(import.meta.dirname, {
  years: new Set<number>(),

  /** The selected term in the courses panel */
  term: '',
  /** <id, label> */
  terms: [] as Term[],

  /** The selected tab in the courses panel */
  tab: 'cards',
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** True if the course is starred, otherwise false. By course ids */
  star: false as boolean,

  /** <year-term-key, coordinate map> */
  coordinatesMap: new Map() as CoordinatesMap,

  /** The key-value pairs of course ids and course positions. By period keys*/
  coursesLayout: new Map() as Layout,
})

/**
 * Combine a year and a term.
 * @param year The year
 * @param term The term
 * @returns A year-term-key
 */
export const getYearTermKey = (year: string | number, term: string) => {
  return `${year}-${term}`
}
