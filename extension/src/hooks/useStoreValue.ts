import { DynamicStore, Store } from "@/utils/createStore";
import { useState } from "react";

/**
 * Returns a stateful value, and a function to update it.
 * A store value is updated when the function is called.
 * @param store The store object
 * @param key The key of the store
 * @returns A tuple of a stateful value and the dispatcher
 */
export const useStoreValue = <T extends Store, K extends keyof T>(store: T, key: K): [T[K], (value: T[K]) => void] => {
  const [value, setValue] = useState(store[key])
  return [
    value,
    value => {
      store[key] = value
      setValue(value)
    }
  ]
}

/**
 * Returns a stateful value, and a function to update it.
 * A dynamic store value is updated when the function is called.
 * @param dynamicStore The dynamic store object
 * @param key The key of the dynamic store
 * @param subKey The sub key of the dynamic store value
 * @returns A tuple of a stateful value and the dispatcher
 */
export const useDynamicStoreValue = <T extends Store, K extends keyof T>(dynamicStore: DynamicStore<T>, key: K, subKey: string): [T[K], (value: T[K]) => void] => {
  const [value, setValue] = useState(dynamicStore[key].get(subKey))
  return [
    value,
    value => {
      dynamicStore[key].set(subKey, value)
      setValue(value)
    }
  ]
}
