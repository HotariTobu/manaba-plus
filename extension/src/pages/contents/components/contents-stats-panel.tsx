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
    </div>
  )
}
