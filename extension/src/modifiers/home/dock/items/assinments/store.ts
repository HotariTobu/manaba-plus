import { createDynamicStore } from "@/utils/createStore";

export const [dynamicStore] = await createDynamicStore(import.meta.dirname, {
  /** <assignment id, whether the assignment is hidden> True if the assignment is hidden, otherwise false */
  hidden: false as boolean,
})
