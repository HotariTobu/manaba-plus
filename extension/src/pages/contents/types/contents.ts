import { DownloadStats, DownloadStatus } from "../utils/download"
import { ScrapingResult } from "../utils/scrape"

export type ContentsStats = {
  excluded: number
  elapsedTime: number
} & DownloadStats

export type ContentsStatus = {
  code: 'excluded'
} | DownloadStatus

export type ContentsItem = {
  status: ContentsStatus
} & ScrapingResult
