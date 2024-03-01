import { cn } from "@/lib/utils"

export const Truncated = (props: {
  text?: string
  className?: string
}) => (
  <div className={cn('truncate', props.className)} title={props.text}>{props.text}</div>
)
