import { getFiscalYear, hiddenPosition } from "@/modifiers/home/config"
import * as home from '@/modifiers/home/dock/items/courses/store';
import { useState } from "react"
import { toast } from "sonner"
import { getScrapingModel } from "../model"
import { store, dynamicStore, localStore } from "../store"
import { ContentsStats, ContentsItem } from "../types/contents"
import { download, DownloadContext, escape } from "../utils/download"
import { ScrapingResult, scrape } from "../utils/scrape"

/** The interval time for download in milliseconds */
const interval = 1000

/**
 * Create scraping context data from store values.
 * @returns An array of the course label, the root url, and the scraping model
 */
const getScrapingContext = () => {
  const year = getFiscalYear()
  const yearModuleKey = home.getYearModuleKey(year, home.store.module)
  const coursesLayout = home.dynamicStore.coursesLayout.get(yearModuleKey)

  const scrapingContext = home.localStore.courses
    .filter(course => {
      if (store.downloadStarredOnly && !home.dynamicStore.star.get(course.id)) {
        return false
      }

      if (!store.downloadHiddenToo) {
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

/**
 * Join path parts with the path separator.
 * @param paths The path parts
 * @returns A joined path string
 */
const joinPath = (...paths: string[]) => {
  const path = paths.join('/')
  if (path.startsWith('/')) {
    return path.substring(1)
  }
  else {
    return path
  }
}

/**
 * The callback to prevent closing the tab while downloading
 */
const preventClosing = (event: Event) => {
  event.preventDefault()
  return false
}

type CancelHandler = () => void

export const useDownload = () => {
  const [status, setStatus] = useState<'initialized' | 'downloading' | 'canceled' | 'completed'>('initialized')
  const [cancelHandlers, setCancelHandlers] = useState<CancelHandler[]>([])

  const [contentsStats, setContentsStats] = useState<ContentsStats | null>(null)
  const [contentsItems, setContentsItems] = useState<ContentsItem[]>([])

  const startDownload = () => {
    const newCancelHandlers: CancelHandler[] = []

    const excludedItems: ContentsItem[] = []

    /** <download url, scraping result> */
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

    /** Represents still scraping url sources */
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
          // Inject the course trace item.
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

    newCancelHandlers.push(() => {
      // Make pending items' status "interrupted by cancellation."
      setContentsItems(prevContentsItems =>
        prevContentsItems.map(item =>
          item.status.code === 'pending' ? {
            ...item,
            status: {
              code: 'interrupted',
              message: 'USER_CANCELED'
            }
          } : item
        )
      )
    })

    const startTime = Date.now()

    // Run per `interval`.
    const timerId = setInterval(() => {
      const { stats, items } = getDownloadStatus()

      // Update states.
      setContentsStats({
        excluded: excludedItems.length,
        elapsedTime: Date.now() - startTime,
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

      // Update the set of courses that should be excluded from downloading.
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

      setStatus('completed')
      disposeDownload()
      cleanUp()
      localStore.lastDownloadTime = Date.now()
    }, interval)

    setStatus('downloading')

    newCancelHandlers.push(() => {
      setStatus('canceled')
    })

    window.addEventListener('beforeunload', preventClosing, false)

    const cleanUp = () => {
      setCancelHandlers([])
      clearInterval(timerId)
      window.removeEventListener('beforeunload', preventClosing, false)
    }

    newCancelHandlers.push(cleanUp)

    setCancelHandlers(newCancelHandlers)
  }

  const cancelDownload = () => {
    for (const cancelHandler of cancelHandlers) {
      cancelHandler()
    }
  }

  return {
    status,
    contentsStats,
    contentsItems,
    startDownload,
    cancelDownload,
  }
}
