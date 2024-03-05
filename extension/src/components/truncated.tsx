import { cn } from "@/lib/utils"

export const Truncated = (props: {
  text: string | null | undefined
  className?: string
}) => (
  <div className={cn('truncate', props.className)} title={props.text ?? ''}>{props.text}</div>
)
