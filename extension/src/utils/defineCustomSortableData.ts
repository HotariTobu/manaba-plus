import { Active, Data, Over } from "@dnd-kit/core";

type CreateCustomSortableData<T> = (data: T) => Data
type GetCustomSortableData<T> = (entry: Active | Over | null) => T | null

export const defineCustomSortableData = <T extends Data>(): [string, CreateCustomSortableData<T>, GetCustomSortableData<T>] => {
  /** An id for custom sortable data */
  const customSortableDataId = crypto.randomUUID()

  /**
   * Create a custom data object.
   * @param data The custom data
   * @returns An object can be passed to useSortable hook
   */
  const createCustomSortableData: CreateCustomSortableData<T> = data => {
    return {
      [customSortableDataId]: data
    }
  }

  /**
   * Get the custom data from an entry object.
   * @param entry The entry object
   * @returns An object attached to the entry object or null
   */
  const getCustomSortableData: GetCustomSortableData<T> = entry => {
    const data = entry?.data?.current?.[customSortableDataId]
    if (typeof data === 'undefined') {
      return null
    }
    else {
      return data
    }
  }

  return [
    customSortableDataId,
    createCustomSortableData,
    getCustomSortableData,
  ]
}
