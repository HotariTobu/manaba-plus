import { cn } from "@/lib/utils"
import { useLongPress } from "@/hooks/useLongPress"
import { usePageContext } from "../../../hooks/usePageContext"
import { useAssignments } from "../hooks/useAssignments"
import { AssignmentsLoading } from "./assignments-loading"
import { ErrorAlert } from "@/components/error-alert"
import { AssignmentsList } from "./assignment-list"

export const AssignmentsContainer = () => {
  const { assignments } = useAssignments()

  const { status, setStatus } = usePageContext()

  const longPress = useLongPress(() => {
    if (status === 'normal') {
      setStatus('editing-assignments')
    }
    else if (status === 'editing-assignments') {
      setStatus('normal')
    }
  }, {
    stopPropagation: status === 'normal' || status === 'editing-assignments'
  })

  if (assignments === null) {
    return <AssignmentsLoading />
  }

  if (assignments instanceof Error) {
    return <ErrorAlert error={assignments} />
  }

  const sortable = status === 'editing-assignments'

  return (
    <div className={cn(sortable ? 'gap-4' : 'gap-2', "flex flex-col")} {...longPress}>
      <AssignmentsList assignments={assignments} sortable={sortable} />
    </div>
  )
}
