import { createStore } from "@/utils/createStore";

export const store = await createStore(import.meta.dirname, {
  tab: 'timetable',
})
