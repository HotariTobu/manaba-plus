import { ForwardRefExoticComponent, useEffect, useState } from "react"
import { ChatBubbleIcon, Pencil1Icon, PersonIcon, ReaderIcon, SpeakerLoudIcon } from "@radix-ui/react-icons"
import { IconProps } from "@radix-ui/react-icons/dist/types"
import { cn } from "@/lib/utils"
import { type Course, StatusType } from "../types/course"
import { statusSuffixes } from "@/modifiers/home/config"
import { fetchDOM } from "@/utils/fetch"
import { f, ff } from "@/utils/element"
import { selectorMap } from "../../../../config"

const Icons: Record<StatusType, ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>> = {
  news: SpeakerLoudIcon,
  assignment: Pencil1Icon,
  grade: ReaderIcon,
  topic: ChatBubbleIcon,
  collection: PersonIcon,
}

/**
 * Get an assignment page url.
 * @param courseUrl The course url
 * @returns An assignment url, or null when cannot find assignment page
 */
const getAssignmentHref = async (courseUrl: string) => {
  const fetchResult = await fetchDOM(courseUrl)
  if ('message' in fetchResult) {
    return null
  }

  const doc = fetchResult.data
  const menus = f(selectorMap.courses.assignments.menus, doc)
  for (const menu of menus) {
    const counter = ff(selectorMap.courses.assignments.counter, menu)
    if (counter === null) {
      continue
    }

    const menuAnchor = ff<HTMLAnchorElement>('a', menu)
    if (menuAnchor !== null) {
      return menuAnchor.href
    }
  }

  return null
}

const StatusAnchor = (props: {
  courseUrl: string
  type: StatusType
  value: boolean
}) => {
  const [assignmentHref, setAssignmentHref] = useState<string | null>(null)

  useEffect(() => {
    if (props.type !== 'assignment') {
      return
    }

    if (!props.value) {
      return
    }

    getAssignmentHref(props.courseUrl).then(setAssignmentHref)
  }, [props.courseUrl, props.type, props.value])

  const Icon = Icons[props.type]
  const suffix = statusSuffixes[props.type]
  if (typeof Icon === 'undefined' || typeof suffix === 'undefined') {
    return
  }

  const href = props.type === 'assignment' && assignmentHref !== null ? assignmentHref : props.courseUrl + suffix

  return (
    <a className={cn(props.value ? 'text-destructive animate-bounce' : 'text-slate-400', 'hover:text-destructive hover:animate-none')} href={href}>
      <Icon className="m-1" />
    </a>
  )
}

export const CourseStatus = (props: {
  course: Course
}) => {
  if (props.course.url === null) {
    return
  }

  const courseUrl = props.course.url

  return (
    <>
      {Object.entries(props.course.status).map(([type, value]) => (
        <StatusAnchor courseUrl={courseUrl} type={type as StatusType} value={value} key={type} />
      ))}
    </>
  )
}
