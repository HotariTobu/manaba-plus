import { createStore } from "@/utils/createStore";

export const store = await createStore(import.meta.dirname, {
  /** The selected tab in the courses panel */
  tab: 'timetable',

  /**
   * The map of course ids and whether the course is starred
   * True if the course is starred, otherwise false
   */
  star: new Map<string, boolean>(),
})
