import { Assignment } from "../types/assignment"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useState } from "react"
import { AssignmentHeader, AssignmentRow, Column } from "./assignment-row"
import { dynamicStore } from "../store"
import { t } from "@/utils/i18n"

type Comparer = (a: Assignment, b: Assignment) => number

const countVisibleAssignments = (assignments: Assignment[]) => {
  let count = 0

  for (const assignment of assignments) {
    if (dynamicStore.hidden.get(assignment.id)) {
      continue
    }
    count++
  }

  return count
}

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

  const comparer = getComparer(sortBy, ascending)
  props.assignments.sort(comparer)

  return (
    <ScrollArea className="rounded-md border-primary border">
      <div className="grid-cols-[auto_auto_minmax(12rem,_5fr)_minmax(8rem,_3fr)_auto] grid">
        <AssignmentHeader sortBy={sortBy} setSortBy={setSortBy} ascending={ascending} setAscending={setAscending} />
        {!props.sortable && countVisibleAssignments(props.assignments) === 0 ? (
          <div className="text-center col-start-1 col-end-[-1]">
            {t('home_assignments_no_assignments')}
          </div>
        ) : props.assignments.map(assignment => (
          <AssignmentRow assignment={assignment} sortable={props.sortable} key={assignment.id} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
