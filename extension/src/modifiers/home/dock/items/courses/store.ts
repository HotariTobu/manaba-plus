import { createDynamicStore, createStore } from "@/utils/createStore";
import { Layout } from "../../types/layout";
import { CoordinatesMap } from "./types/coordinate";
import { Module } from "./types/module";

export const [store] = await createStore(import.meta.dirname, {
  /** The selectable years */
  years: new Set<number>(),

  /** The selected module */
  module: '',
  /** The selectable modules */
  modules: [] as Module[],

  /** The selected tab */
  tab: 'cards',
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** <course id, whether the course is starred> True if the course is starred, otherwise false */
  star: false as boolean,

  /** <year-module-key, coordinate map> Locations of courses in a timetable by years and modules */
  coordinatesMap: new Map() as CoordinatesMap,

  /** <year-module-key, courses layout> Positions of courses in sortable containers */
  coursesLayout: new Map() as Layout,
})

/**
 * Combine a year and a module.
 * @param year The year
 * @param module The module
 * @returns A year-module-key
 */
export const getYearModuleKey = (year: string | number, module: string) => {
  return `${year}-${module}`
}
