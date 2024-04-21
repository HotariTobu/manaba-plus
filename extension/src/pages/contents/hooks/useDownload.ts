import { getFiscalYear, hiddenPosition } from "@/modifiers/home/config"
import * as home from '@/modifiers/home/dock/items/courses/store';
import { useState } from "react"
import { toast } from "sonner"
import { getScrapingModel } from "../model"
import { store, dynamicStore, localStore } from "../store"
import { ContentsStats, ContentsItem } from "../types/contents"
import { download, DownloadContext, escape } from "../utils/download"
import { ScrapingResult, scrape } from "../utils/scrape"

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
        rootLabel: course.title,
        rootUrl: course.url,
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
    newCancelHandlers.push(cancelDownload)

    const downloadDestination = escape(store.downloadDestination)
    const handleScrape = (result: ScrapingResult) => {
      const { trace, target } = result
      const { url } = target
      const pathItems = trace
        .concat(target)
        .map(({ label }) => escape(label))

      const downloadContext: DownloadContext = {
        url,
        path: joinPath(downloadDestination, ...pathItems)
      }

      if (localStore.excludedSet.has(url)) {
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
    }

    const scrapingRootUrlSet = new Set<string>()

    const scrapingContext = getScrapingContext()
    for (const { rootLabel, rootUrl, scrapingModel } of scrapingContext) {
      if (rootUrl === null) {
        continue
      }

      scrapingRootUrlSet.add(rootUrl)

      const source = {
        label: rootLabel,
        url: rootUrl,
      }
      const { cancelScraping } = scrape(rootUrl, scrapingModel, {
        onScrape: ({ trace, target }) => {
          handleScrape({
            trace: [source, ...trace],
            target,
          })
        },
        onError: (url, message) => {
          toast.error(`Scraping Error: ${message} @ ${url}`)
        },
        onComplete: () => {
          scrapingRootUrlSet.delete(rootUrl)
        }
      })
      newCancelHandlers.push(cancelScraping)
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

      localStore.excludedSet = new Set([
        ...localStore.excludedSet,
        ...items
          .filter(({ status }) => status.code === 'completed')
          .map(({ context }) => context.url)
      ])

      if (stats.pending > 0 || scrapingRootUrlSet.size > 0) {
        queueDownload()
        return
      }

      if (stats.downloading > 0) {
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
