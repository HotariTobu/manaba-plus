import { safeFetchDOM } from "@/utils/fetch";
import { ScrapingNode } from "../types/scrapingNode";
import { f } from "@/utils/element";

type ScrapingTraceItem = {
  label: string
  url: string
}

type ScrapingTrace = ReadonlyArray<ScrapingTraceItem>

export type ScrapingResult = {
  /**
   * A label and url list expressing the scraping path.
   * parent <---> child
   */
  trace: ScrapingTrace

  /** The end item of the scraping path */
  target: ScrapingTraceItem
}

type ScrapingOptions = {
  /** A callback called when some scraping result was gotten */
  onScrape: (result: ScrapingResult) => void,

  /** A callback called when some error occurred on fetching */
  onError: (url: string, message: string) => void,

  /** A callback called when scraping was completed */
  onComplete: () => void
}

/**
 * Start a scraping session.
 * @param rootUrl The root url from which the scraping is started
 * @param model The scraping model
 * @param options Callbacks of the scraping session
 * @returns Methods to manipulate the scraping session
 */
export const scrape = (rootUrl: string, model: ScrapingNode[], options: ScrapingOptions) => {
  let canceled = false

  const internalScrape = async (url: string, nodes: ScrapingNode[], trace: ScrapingTrace) => {
    if (canceled) {
      return
    }

    const fetchPromises = nodes.map(node =>
      Promise.all([
        node,
        safeFetchDOM(url + (node.urlPrefix ?? ''))
      ])
    )
    const fetchResults = await Promise.all(fetchPromises)

    const scrapePromises: Promise<void>[] = []

    for (const [node, fetchResult] of fetchResults) {
      if (!fetchResult.success) {
        options.onError(url + node.urlPrefix, fetchResult.message)
        continue
      }

      const doc = fetchResult.data
      const anchors = f<HTMLAnchorElement>(node.anchorSelector, doc)
      const items = anchors.map<ScrapingTraceItem>(({ href, textContent }) => ({
        label: textContent === null ? '' : textContent.trim(),
        url: href,
      }))

      if (node.urlPrefix === null) {
        for (const item of items) {
          options.onScrape({
            trace,
            target: item,
          })
        }
      } else {
        for (const item of items) {
          const scrapePromise = internalScrape(item.url, node.children, [...trace, item])
          scrapePromises.push(scrapePromise)
        }
      }
    }

    await Promise.all(scrapePromises)
  }

  internalScrape(rootUrl, model, []).then(options.onComplete)

  return {
    cancelScraping: () => canceled = true
  }
}
