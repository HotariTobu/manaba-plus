import { cn } from "@/lib/utils"
import { CubeIcon } from "@radix-ui/react-icons"

export const CourseIcon = ({ src, className, ...props }: {
  src: string | null
  className?: string
}) => {
  if (src === null) {
    return <CubeIcon className={cn('h-full', className)} {...props} />
  }
  else {
    return <img src={src} className={className} {...props} />
  }
}
