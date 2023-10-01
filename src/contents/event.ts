import Scraper from './scrape'
import * as insert from './insert'
import * as notify from './notify'
import * as history from './history'
import { sha256 } from '../utils/hash'
import * as download from './download'
import * as time from '../utils/time'
import { updateDate } from '../notification/download'

const startButton = document.querySelector('#start-button')
const cancelButton = document.querySelector('#cancel-button')
const testButton = document.querySelector('#test-button')
if (startButton === null || cancelButton === null || testButton === null) {
  throw new Error('NullReference: Buttons')
}

let scraper: Scraper = null

/**
 * An object that downloading stats is in
 */
const stats = {
  'fetch-count': 0,
  'pending-count': 0,
  'downloading-count': 0,
  'interrupted-count': 0,
  'completed-count': 0,
  'excluded-count': 0,

  'contents-count': 0,

  /**
   * Begin time for elapsed time
   */
  lastTime: 0,

  /**
   * False if the measuring is stopped, otherwise true
   */
  isMeasuring: false,
}

// Make `contents-count` a getter that returns the sum of item counts.
Object.defineProperty(stats, 'contents-count', {
  get() {
    // Ignore `fetch-count`, `contents-count`, `lastTime`, and `isMeasuring`.
    const keys = Object.keys(stats).slice(1, -3)
    const values = keys.map((key) => stats[key] as number)
    return values.reduce((sum, value) => sum + value, 0)
  },
  set() {},
})

const startMeasuring = function () {
  if (stats.isMeasuring) {
    return
  }

  stats.isMeasuring = true

  // Reset stats and get elements.
  const keys = Object.keys(stats).slice(0, -2)
  const elements: [string, Element][] = []

  for (const key of keys) {
    stats[key] = 0

    const element = document.getElementById(key)
    if (element === null) {
      continue
    }

    elements.push([key, element])
  }

  stats.lastTime = performance.now()
  const elapsedTime = document.querySelector('#elapsed-time')

  // Refresh the stats in the view per 500ms.
  const timer = setInterval(function () {
    if (scraper !== null) {
      insert.updateProgress(scraper.currentTraces)
      stats['fetch-count'] = scraper.fetchCount
    }

    for (const [key, element] of elements) {
      element.textContent = stats[key]
    }

    const totalMilliseconds = performance.now() - stats.lastTime
    if (elapsedTime !== null) {
      elapsedTime.textContent = time.toString(totalMilliseconds)
    }

    if (stats.isMeasuring) {
      return
    }

    clearInterval(timer)

    stats.isMeasuring = false
  }, 500)
}

const stopMeasuring = function () {
  stats.isMeasuring = false
}

/**
 * The callback to prevent closing the tab while downloading
 */
const preventClosing = function (event: Event) {
  event.preventDefault()
  event.returnValue = false
  return false
}

const startDownload = async function () {
  if (scraper !== null) {
    return
  }

  startMeasuring()

  startButton.setAttribute('disabled', '')
  cancelButton.removeAttribute('disabled')

  insert.clearProgress()
  insert.clearContents()
  notify.hideMessages()

  window.addEventListener('beforeunload', preventClosing, false)

  const exclusionList = await history.getHistory()
  const addExclusion = function (context: ContentContext) {
    exclusionList.add(context.hash)
  }

  scraper = new Scraper(async function (context: ContentContext) {
    context.hash = await sha256(context.url)
    context.excluded = exclusionList.has(context.hash)

    insert.appendContent(context)

    if (context.excluded) {
      stats['excluded-count']++
      return
    }

    download.reserveDownload(context)
    stats['pending-count']++
  }, insert.appendError)

  let isCanceled = true

  const downloadTimer = setInterval(async function () {
    await download.requestDownload()
    const stacks = download.takeStacks()

    stacks.completed.forEach(addExclusion)

    insert.updateContents(stacks)

    stats['pending-count'] -=
      stacks.interrupted.length + stacks.completed.length
    stats['downloading-count'] = stacks.downloading.length
    stats['interrupted-count'] += stacks.interrupted.length
    stats['completed-count'] += stacks.completed.length

    if (scraper !== null || !stacks.isEmpty) {
      return
    }

    // If completely finished downloading...

    clearInterval(downloadTimer)

    history.setHistory(exclusionList)

    window.removeEventListener('beforeunload', preventClosing, false)

    if (isCanceled) {
      notify.showCanceledMessage()
    } else {
      notify.showCompletedMessage()
    }

    startButton.removeAttribute('disabled')
    cancelButton.setAttribute('disabled', '')

    stopMeasuring()

    await updateDate()
  }, 1000)

  await scraper.scrape()

  isCanceled = scraper === null
  if (!isCanceled) {
    insert.clearProgress()
    scraper = null
  }
}

const cancelDownload = async function () {
  cancelButton.setAttribute('disabled', '')

  scraper?.cancel()
  await download.cancelDownload()

  scraper = null
}

const testScraping = async function () {
  if (scraper !== null) {
    return
  }

  startMeasuring()

  startButton.setAttribute('disabled', '')
  testButton.setAttribute('disabled', '')

  insert.clearContents()

  scraper = new Scraper(function (context: ContentContext) {
    stats['pending-count']++
    insert.appendContent(context)
  }, insert.appendError)

  await scraper.scrape()

  insert.clearProgress()

  startButton.removeAttribute('disabled')
  testButton.removeAttribute('disabled')

  stopMeasuring()

  scraper = null
}

// Entry point
export default function () {
  startButton.addEventListener('click', startDownload)
  cancelButton.addEventListener('click', cancelDownload)
  testButton.addEventListener('click', testScraping)
}
