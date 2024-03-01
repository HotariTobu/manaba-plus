import { ForwardRefExoticComponent } from "react"
import { ChatBubbleIcon, Pencil1Icon, PersonIcon, ReaderIcon, SpeakerLoudIcon } from "@radix-ui/react-icons"
import { IconProps } from "@radix-ui/react-icons/dist/types"
import { cn } from "@/lib/utils"
import { type Course, StatusType } from "../types/course"

const Icons: { [key in StatusType]: ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>> } = {
  [StatusType.News]: SpeakerLoudIcon,
  [StatusType.Assignment]: Pencil1Icon,
  [StatusType.Grade]: ReaderIcon,
  [StatusType.Topic]: ChatBubbleIcon,
  [StatusType.Collection]: PersonIcon,
}

export const CourseStatus = (props: {
  course: Course
}) => {
  return (
    <>
      {Object.entries(props.course.status).map(([type, value]) => {
        const Icon = Icons[parseInt(type) as StatusType]
        return (
          <a className={cn(value ? 'text-red-500 animate-pulse' : 'text-slate-400', 'hover:text-red-500 hover:animate-none')} key={type}>
            <Icon className="m-1" />
          </a>
        )
      })}
    </>
  )
}
