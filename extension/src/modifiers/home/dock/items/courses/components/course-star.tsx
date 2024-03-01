import { useState } from "react"
import { cn } from "@/lib/utils"
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons"
import { dynamicStore } from "../store"

export const CourseStar = (props: {
  courseId: string
}) => {
  const [starred, setStarred] = useState(dynamicStore.star.get(props.courseId))
  const Icon = starred ? StarFilledIcon : StarIcon

  const handleClick = () => {
    setStarred(!starred)
    dynamicStore.star.set(props.courseId, !starred)
  }

  return (
    <div className={cn(starred ? "text-yellow-400 hover:text-slate-400" : "text-slate-400 hover:text-yellow-400")} onClick={handleClick}>
      <Icon className="m-1" />
    </div>
  )
}
