import { safeFetchDOM } from "@/utils/fetch";
import { ScrapingNode } from "../types/scrapingNode";
import { f } from "@/utils/element";

type ScrapingResult = {
  parentUrl: string
  url: string
  trace: string[]
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

  const internalScrape = async (url: string, nodes: ScrapingNode[], trace: string[]) => {
    if (canceled) {
      return
    }

    const fetchPromises = nodes.map(node =>
      Promise.all([
        node,
        safeFetchDOM(url + node.urlPrefix ?? '')
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
      const items = anchors.map(({ href, textContent }) => ({
        url: href,
        label: textContent === null ? '' : textContent.trim(),
      }))

      if (node.urlPrefix === null) {
        for (const { url, label } of items) {
          options.onScrape({
            parentUrl: doc.baseURI,
            url,
            trace: [label, ...trace],
          })
        }
      } else {
        for (const { url, label } of items) {
          const scrapePromise = internalScrape(url, node.children, [label, ...trace])
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
