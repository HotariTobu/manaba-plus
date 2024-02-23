import { createStore } from "@/utils/createStore";
import type { Layout } from "./types/layout";

export const store = await createStore(import.meta.dirname, {
  middle: 10000,
  pageLayout: new Map() as Layout
})
