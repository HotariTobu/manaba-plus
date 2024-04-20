import { getFiscalYear, hiddenPosition } from "@/modifiers/home/config"
import * as home from '@/modifiers/home/dock/items/courses/store';
import { useState } from "react"
import { toast } from "sonner"
import { getScrapingModel } from "../model"
import { store, dynamicStore } from "../store"
import { ContentsStats, ContentsItem } from "../types/contents"
import { download, DownloadContext, escape } from "../utils/download"
import { ScrapingOptions, ScrapingResult, scrape } from "../utils/scrape"

const interval = 1000

const getScrapingContext = () => {
  const year = getFiscalYear()
  const yearModuleKey = home.getYearModuleKey(year, home.store.module)
  const coursesLayout = home.dynamicStore.coursesLayout.get(yearModuleKey)

  const scrapingContext = home.localStore.courses
    .filter(course => {
      if (store.downloadOnlyStarred && !home.dynamicStore.star.get(course.id)) {
        return false
      }

      if (!store.downloadRemoved) {
        const position = coursesLayout.get(course.id)
        if (position === hiddenPosition) {
          return false
        }
      }

      return true
    })
    .map(course => {
      const ignoreSet = dynamicStore.ignoredSet.get(course.id) ?? store.defaultIgnoredSet
      const scrapingModel = getScrapingModel(ignoreSet)
      return {
        rootUrl: course.code,
        scrapingModel,
      }
    })
  return scrapingContext
}

const joinPath = (...paths: string[]) => {
  return paths.join('/')
}

type CancelHandler = () => void

export const useDownload = () => {
  const [cancelHandlers, setCancelHandlers] = useState<CancelHandler[]>([])
  const downloading = cancelHandlers.length > 0

  const [contentsStats, setContentsStats] = useState<ContentsStats | null>(null)
  const [contentsItems, setContentsItems] = useState<ContentsItem[]>([])

  const startDownload = () => {
    const newCancelHandlers: CancelHandler[] = []

    const excludedItems: ContentsItem[] = []

    /** <download url, parent url> */
    const scrapingResultMap = new Map<string, ScrapingResult>()

    const { queueDownload, reserveDownload, getDownloadStatus, disposeDownload, cancelDownload } = download(store.downloadLimit)
    cancelHandlers.push(cancelDownload)

    const downloadDestination = escape(store.downloadDestination)
    const scrapingOptions: ScrapingOptions = {
      onScrape: result => {
        const { url } = result.target
        const pathItems = result.trace.map(({ label }) => escape(label))

        const downloadContext: DownloadContext = {
          url,
          path: joinPath(downloadDestination, ...pathItems)
        }

        if (store.excludedSet.has(url)) {
          excludedItems.push({
            status: {
              code: 'excluded',
            },
            ...result,
          })
        }
        else {
          scrapingResultMap.set(url, result)
          reserveDownload(downloadContext)
        }
      },
      onError: (url, message) => {
        toast(`Scraping Error: ${message} @ ${url}`)
      },
    }

    const scrapingRootUrlSet = new Set<string>()

    const scrapingContext = getScrapingContext()
    for (const { rootUrl, scrapingModel } of scrapingContext) {
      if (rootUrl === null) {
        continue
      }

      scrapingRootUrlSet.add(rootUrl)

      const { cancelScraping } = scrape(rootUrl, scrapingModel, {
        ...scrapingOptions,
        onComplete: () => {
          scrapingRootUrlSet.delete(rootUrl)
        }
      })
      cancelHandlers.push(cancelScraping)
    }

    const timerId = setInterval(() => {
      const { stats, items } = getDownloadStatus()

      setContentsStats({
        excluded: excludedItems.length,
        ...stats,
      })

      const newContentsItems = excludedItems
        .concat(items.map(({ context, status }) => {
          const result = scrapingResultMap.get(context.url)
          if (typeof result === 'undefined') {
            throw new Error(`ScrapingResult not found: ${JSON.stringify(context)}`)
          }
          return {
            status,
            ...result
          }
        }))
      setContentsItems(newContentsItems)

      store.excludedSet = new Set([
        ...store.excludedSet,
        ...items
          .filter(({ status }) => status.code === 'completed')
          .map(({ context }) => context.url)
      ])

      if (stats.pending > 0 || scrapingRootUrlSet.size > 0) {
        queueDownload()
        return
      }

      // If completely finished downloading...

      clearInterval(timerId)
      disposeDownload()
      setCancelHandlers([])
    }, interval)

    newCancelHandlers.push(() => {
      clearInterval(timerId)
    })

    setCancelHandlers(newCancelHandlers)
  }

  const cancelDownload = () => {
    for (const cancelHandler of cancelHandlers) {
      cancelHandler()
    }
    setCancelHandlers([])
  }

  return {
    downloading,
    contentsStats,
    contentsItems,
    startDownload,
    cancelDownload,
  }
}
