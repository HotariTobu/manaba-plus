import { t } from "@/utils/i18n"
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SortableContainer } from "@/components/sortable/sortable-container"
import { useLongPress } from "@/hooks/useLongPress"
import { usePageContext } from "../../../hooks/usePageContext"
import { Trash } from "../../../components/trash"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { allCoursesPath } from "@/modifiers/home/config"
import { useAssignments } from "../hooks/useAssignments"
import { AssignmentsLoading } from "./assignments-loading"
import { ErrorAlert } from "@/components/error-alert"

// const Overlay = (props: {
//   item: Course
// }) => <CourseCardBase className="shadow-xl w-80 h-fit absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grabbing" course={props.item} sortable />

export const AssignmentsContainer = () => {
  const { assignmentsMap, setAssignmentsMap, storeAssignmentsMap } = useAssignments()

  const { status, setStatus } = usePageContext()
  const dragging = useRef(false)

  const longPress = useLongPress(() => {
    if (dragging.current) {
      return
    }

    if (status === 'normal') {
      setStatus('editing-assignments')
    }
    else if (status === 'editing-assignments') {
      setStatus('normal')
    }
  }, {
    stopPropagation: status === 'normal' || status === 'editing-assignments'
  })

  const sortable = status === 'editing-assignments'

  console.log(assignmentsMap)
  return <AssignmentsLoading/>

  if (assignmentsMap === null) {
    return <AssignmentsLoading/>
  }

  if (assignmentsMap instanceof Error) {
    return <ErrorAlert error={assignmentsMap}/>
  }

  return (
    <div className={cn(sortable ? 'gap-4' : 'gap-2', "flex flex-col")} {...longPress}>
      <SortableContainer itemsMap={assignmentsMap} setItemsMap={setAssignmentsMap} onDropped={storeAssignmentsMap} setIsDragging={d => dragging.current = d}>

      </SortableContainer>
    </div>
  )
}
