import { createStore } from "@/utils/createStore";

export const [o] = await createStore(import.meta.dirname, {
  /** The url of top page */
  rootUrl: ''
})
