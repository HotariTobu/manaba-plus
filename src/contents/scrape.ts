import { FetchResult, fetchDOM } from '../utils/fetch'
import getModel from './model'
import './model.type'
import getOptions from '../options/model'

export default class Scraper {
  /**
   * Traces to create and show progress.
   */
  private __currentTraces: ScrapingTrace[]
  private __fetchCount: number

  private __isScraping: boolean

  public get currentTraces(): ScrapingTrace[] {
    return this.__currentTraces
  }

  public get fetchCount(): number {
    return this.__fetchCount
  }

  /**
   * @param contextCallback The callback to get items
   * @param errorCallback The callback to get errors
   */
  constructor(
    private readonly contextCallback: (context: DownloadContext) => void,
    private readonly errorCallback: (url: string, message: string) => void
  ) {
    this.__isScraping = false
  }

  /**
   * Start scraping with the scraping model.
   * Result items are sent with a callback.
   */
  public async scrape() {
    if (this.__isScraping) {
      return
    }

    const { options } = await getOptions()

    this.__isScraping = true

    this.__currentTraces = []
    this.__fetchCount = 0

    const model = await getModel()

    const homeUrl = options.common['root-url'].value + 'home'
    const fetchResult = await fetchDOM(homeUrl)

    await this.__scrape(model, fetchResult, [])

    this.__isScraping = false
  }

  /**
   * Cancel scraping.
   */
  public cancel() {
    this.__isScraping = false
  }

  /**
   * Search URLs in a document and fetch the next pages in accordance with a scraping node.
   * Return items through the callback `returnContext` if the node has no children.
   * @param node The scraping node navigating the next pages
   * @param doc The DOM document that URLs are found
   * @param traces Traces passed from the parent scraping
   */
  private async __scrape(
    node: ScrapingNode,
    fetchResult: FetchResult<Document>,
    traces: ScrapingTrace[]
  ) {
    if (!this.__isScraping) {
      return
    }

    if (fetchResult.error) {
      this.errorCallback(fetchResult.url, fetchResult.message)
      return
    }

    this.__currentTraces = traces

    const doc = fetchResult.data
    const anchors = doc.querySelectorAll<HTMLAnchorElement>(node.selectors)
    const items = Array.from(anchors).map((anchor) => [
      anchor.href,
      anchor.textContent.trim(),
    ])

    if (typeof node.filter !== 'undefined') {
      const temp = items.splice(0)
      for (const item of temp) {
        const [url] = item
        if (await node.filter(url)) {
          items.push(item)
        }
      }
    }

    if (typeof node.children === 'undefined') {
      const parentUrl = doc.baseURI

      for (const [url, token] of items) {
        const context = {
          parentUrl,
          url,
          tokens: [token, ...traces.map((trace) => trace.token)],
        }

        this.contextCallback(context)
      }
    } else {
      const promises: Promise<void>[] = []

      for (let index = 0; index < items.length; index++) {
        const item = items[index]
        const [url, token] = item
        const max = items.length
        const trace: ScrapingTrace = { token, max, index }

        const docMap = new Map<string, FetchResult<Document>>()

        for (const child of node.children) {
          const prefix = child.prefix ?? ''
          if (docMap.has(prefix)) {
            continue
          }

          const fetchResult = await fetchDOM(url + prefix)
          docMap.set(prefix, fetchResult)

          this.__fetchCount++
        }

        for (const child of node.children) {
          const prefix = child.prefix ?? ''
          const fetchResult = docMap.get(prefix)

          const promise = this.__scrape(child, fetchResult, [trace, ...traces])
          promises.push(promise)
        }
      }

      await Promise.all(promises)
    }
  }
}
