import { Assignment } from "../types/assignment"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useState } from "react"
import { AssignmentHeader, AssignmentRow, Column } from "./assignment-row"

type Comparer = (a: Assignment, b: Assignment) => number

/**
 * Get a compare function of the specific sorting method.
 * @param sortBy The column by which assignments are sort
 * @param ascending True if the order is ascending
 * @returns A compare function
 */
const getComparer = (sortBy: Column, ascending: boolean): Comparer => {
  const sign = (comparer: Comparer): Comparer => {
    if (ascending) {
      return comparer
    }
    else {
      return (a, b) => -comparer(a, b)
    }
  }

  switch (sortBy) {
    case 'type':
      return sign((a, b) => {
        if (a.type === null) {
          return 1
        }
        if (b.type === null) {
          return -1
        }
        return a.type.label.localeCompare(b.type.label)
      })
    case 'title':
      return sign((a, b) => {
        return a.title.localeCompare(b.title)
      })
    case 'course':
      return sign((a, b) => {
        if (a.course === null) {
          return 1
        }
        if (b.course === null) {
          return -1
        }
        return a.course.title.localeCompare(b.course.title)
      })
    case 'deadline':
      return sign((a, b) => {
        if (a.deadline === null) {
          return 1
        }
        if (b.deadline === null) {
          return -1
        }
        return a.deadline.getTime() - b.deadline.getTime()
      })
  }
}

export const AssignmentsList = (props: {
  assignments: Assignment[]
  sortable: boolean
}) => {
  const [sortBy, setSortBy] = useState<Column>('deadline')
  const [ascending, setAscending] = useState(true)

  if (props.assignments.length === 0 && !props.sortable) {
    return
  }

  const comparer = getComparer(sortBy, ascending)
  props.assignments.sort(comparer)

  return (
    <ScrollArea className="rounded-md border-primary border">
      <div className="grid" style={{
        gridTemplateColumns: `${props.sortable ? 'auto' : ''} auto minmax(12rem, 5fr) minmax(8rem, 3fr) auto`,
      }}>
        <AssignmentHeader sortBy={sortBy} setSortBy={setSortBy} ascending={ascending} setAscending={setAscending} />
        {props.assignments.map(assignment => (
          <AssignmentRow assignment={assignment} sortable={props.sortable} key={assignment.id} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
