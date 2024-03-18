import { Active, Collision, Data, Over } from "@dnd-kit/core";

type CreateCustomDnDData<T> = (data: T) => Data
type GetCustomDnDData<T> = (entry: Collision | Active | Over | null) => T | null

export const defineCustomDnDData = <T extends Data>(): [string, CreateCustomDnDData<T>, GetCustomDnDData<T>] => {
  /** An id for custom sortable data */
  const customDnDDataId = crypto.randomUUID()

  /**
   * Create a custom data object.
   * @param data The custom data
   * @returns An object can be passed to useDnD hook
   */
  const createCustomDnDData: CreateCustomDnDData<T> = data => {
    return {
      [customDnDDataId]: data
    }
  }

  /**
   * Get the custom data from an entry object.
   * @param entry The entry object
   * @returns An object attached to the entry object or null
   */
  const getCustomDnDData: GetCustomDnDData<T> = entry => {
    const commonData = entry?.data
    if (typeof commonData === 'undefined') {
      return null
    }

    if ('current' in commonData) {
      const data = commonData.current?.[customDnDDataId]
      if (typeof data === 'object') {
        return data
      }
    }
    else if ('droppableContainer' in commonData) {
      const data = commonData.droppableContainer?.data?.current?.[customDnDDataId]
      if (typeof data === 'object') {
        return data
      }
    }

    return null
  }

  return [
    customDnDDataId,
    createCustomDnDData,
    getCustomDnDData,
  ]
}
