import { useEffect, useState } from "react"
import { itemsMapFromLayout, itemsMapToLayout } from "../../../../layout";
import { Assignment } from "../../types/assignment"
import { getAssignments } from "./assignments"
import { ItemsMap } from "@/components/sortable/item"
import { store } from "../../store"
import { Position } from "../../types/position";

let assignments: Assignment[] | null = null

const getMemorizedAssignments = async () => {
  if (assignments === null) {
    assignments = await getAssignments()
    return assignments
  }
  else {
    return assignments
  }
}

export const useAssignments = () => {
  const [assignmentsMap, setAssignmentsMap] = useState<ItemsMap<Assignment> | Error | null>(null)

  // Restore a layout of a assignment map.
  useEffect(() => {
    getMemorizedAssignments().then(assignments => {
      const assignmentPairs = assignments.map<[Position, Assignment]>(assignment => {
        return ['general', assignment]
      })

      const assignmentsMap = itemsMapFromLayout(assignmentPairs, store.assignmentLayout)
      setAssignmentsMap(assignmentsMap)
    }).catch(error => {
      setAssignmentsMap(error)
    })
  }, [])

  /**
   * Store a layout of a assignments map.
   * @param assignmentsMap The assignments map to be stored
   * @returns
   */
  const storeAssignmentsMap = (assignmentsMap: ItemsMap<Assignment>) => {
    const layout = itemsMapToLayout(assignmentsMap)
    store.assignmentLayout = layout
  }

  return {
    assignmentsMap,
    setAssignmentsMap,
    storeAssignmentsMap,
  }
}
