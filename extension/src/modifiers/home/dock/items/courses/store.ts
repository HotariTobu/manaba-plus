import { createDynamicStore, createStore } from "@/utils/createStore";
import { Layout } from "../../types/layout";
import { CoordinatesMap } from "./types/coordinate";
import { Term } from "./types/term";

export const [store] = await createStore(import.meta.dirname, {
  /** The selectable years */
  years: new Set<number>(),

  /** The selected term */
  term: '',
  /** The selectable terms */
  terms: [] as Term[],

  /** The selected tab */
  tab: 'cards',
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** <course id, whether the course is starred> True if the course is starred, otherwise false */
  star: false as boolean,

  /** <year-term-key, coordinate map> Locations of courses in a timetable by years and terms */
  coordinatesMap: new Map() as CoordinatesMap,

  /** <year-term-key, courses layout> Positions of courses in sortable containers */
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
