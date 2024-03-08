import { t } from "@/utils/i18n";
import { createDynamicStore, createStore } from "@/utils/createStore";
import { Layout } from "../../types/layout";
import { Period } from "./types/period";

export const [store] = await createStore(import.meta.dirname, {
  term: t('home_courses_default_term'),

  /** The selected tab in the courses panel */
  tab: 'cards',

  /** The key-value pairs of course ids and course positions*/
  courseLayout: new Map() as Layout,
})

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** True if the course is starred, otherwise false */
  star: false as boolean,

  /** The course's timetable span */
  period: null as Period | null,
})

export const [sessionStore] = await createStore(import.meta.dirname, {
  years: [] as string[],
  terms: [] as string[],
}, 'session')
