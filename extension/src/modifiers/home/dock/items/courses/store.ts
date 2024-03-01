import { createDynamicStore, createStore } from "@/utils/createStore";

export const [store] = await createStore(import.meta.dirname, {
  /** The selected tab in the courses panel */
  tab: 'timetable',
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** True if the course is starred, otherwise false */
  star: false as boolean,
})
