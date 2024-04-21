import { t } from "@/utils/i18n"
import { ContentsStats } from "../types/contents"
import { ReactNode } from "react"

const ContentsStatsRow = (props: {
  label: string
  value: ReactNode
}) => (
  <>
    <div className="text-end">{t(`contents_stats_${props.label}`)}</div>
    <div className="text-start">{props.value}</div>
  </>
)

/**
 * Get a string from a time number.
 * @param milliseconds The time in milliseconds
 * @returns Formatted time string like 1:23
 */
const getTimeString = (milliseconds: number) => {
  const totalSeconds = milliseconds / 1000
  const minutes = (totalSeconds / 60).toFixed().padStart(2, '0')
  const seconds = (totalSeconds % 60).toFixed().padStart(2, '0')
  return `${minutes}:${seconds}`
}

export const ContentsStatsPanel = (props: {
  contentsStats: ContentsStats | null
}) => {
  if (props.contentsStats === null) {
    return
  }

  return (
    <div className="text-base gap-x-2 gap-y-1 grid grid-cols-2">
      <ContentsStatsRow label="pending_count" value={props.contentsStats.pending} />
      <ContentsStatsRow label="downloading_count" value={props.contentsStats.downloading} />
      <ContentsStatsRow label="interrupted_count" value={props.contentsStats.interrupted} />
      <ContentsStatsRow label="completed_count" value={props.contentsStats.completed} />
      <ContentsStatsRow label="excluded_count" value={props.contentsStats.excluded} />
      <ContentsStatsRow label="elapsed_time" value={getTimeString(props.contentsStats.elapsedTime)} />
    </div>
  )
}
