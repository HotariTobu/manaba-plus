import { createStore } from "@/utils/createStore";

export const [o] = await createStore(import.meta.dirname, {
  /** The url of top page */
  rootUrl: ''
})

/**
 * Determine if the user needs to go home and init the store.
 * @returns True if the initialization is required, otherwise false
 */
export const isStoreInitializationRequired = () => {
  return o.rootUrl === ''
}
