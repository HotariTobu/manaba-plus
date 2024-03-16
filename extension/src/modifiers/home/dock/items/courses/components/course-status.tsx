import { ForwardRefExoticComponent } from "react"
import { ChatBubbleIcon, Pencil1Icon, PersonIcon, ReaderIcon, SpeakerLoudIcon } from "@radix-ui/react-icons"
import { IconProps } from "@radix-ui/react-icons/dist/types"
import { cn } from "@/lib/utils"
import { type Course, StatusType } from "../types/course"
import { statusSuffixes } from "@/modifiers/home/config"

const Icons: Record<StatusType, ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>> = {
  news: SpeakerLoudIcon,
  assignment: Pencil1Icon,
  grade: ReaderIcon,
  topic: ChatBubbleIcon,
  collection: PersonIcon,
}

export const CourseStatus = (props: {
  course: Course
}) => {
  return (
    <>
      {Object.entries(props.course.status).map(([type, value]) => {
        const Icon = Icons[type as StatusType]
        const suffix = statusSuffixes[type as StatusType]
        if (typeof Icon === 'undefined' || typeof suffix === 'undefined') {
          return
        }

        return (
          <a className={cn(value ? 'text-red-500 animate-bounce' : 'text-slate-400', 'hover:text-red-500 hover:animate-none')} href={props.course.url + suffix} key={type}>
            <Icon className="m-1" />
          </a>
        )
      })}
    </>
  )
}
