import { createStore } from "@/utils/createStore";

export const store = await createStore(import.meta.dirname, {
  /** The selected tab in the courses panel */
  tab: 'timetable',
})
