import { Progress } from "@/components/ui/progress"
import { ContentsStats } from "../types/contents"

export const ContentsProgress = (props: {
  contentsStats: ContentsStats | null
}) => {
  if (props.contentsStats === null) {
    return
  }

  const { pending, downloading, interrupted, completed } = props.contentsStats
  const value = 100 * (interrupted + completed) / (pending + downloading + interrupted + completed)

  return (
    <Progress value={value} />
  )
}
