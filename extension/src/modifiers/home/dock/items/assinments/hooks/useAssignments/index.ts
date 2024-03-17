import { useEffect, useState } from "react"
import { Assignment } from "../../types/assignment"
import { getAssignments } from "./assignments"

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
  const [assignments, setAssignments] = useState<Assignment[] | Error | null>(null)

  useEffect(() => {
    getMemorizedAssignments().then(assignments => {
      setAssignments(assignments)
    }).catch(error => {
      setAssignments(error)
    })
  }, [])

  return {
    assignments,
  }
}
