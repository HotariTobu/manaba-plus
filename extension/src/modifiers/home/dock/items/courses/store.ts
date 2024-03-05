import { createDynamicStore, createStore } from "@/utils/createStore";
import { Layout } from "../../types/layout";
import { TimetableCoordinate } from "./types/timetableCoordinate";

export const [store] = await createStore(import.meta.dirname, {
  /** The selected tab in the courses panel */
  tab: 'cards',

  /** The key-value pairs of course ids and course positions*/
  courseLayout: new Map() as Layout,
  timetableCoordinates: new Map<string, TimetableCoordinate>(),
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** True if the course is starred, otherwise false */
  star: false as boolean,

  /** The course's timetable span */
  span: 1,
})
