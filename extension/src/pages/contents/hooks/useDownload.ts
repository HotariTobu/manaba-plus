import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

interface DownloadContext {
  url: string
  path: string
}

/**
 * The regex to replace illegal strings in the filename.
 */
const invalidRegex = /[<>:"/\\|?*~]| - \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\s*$/g
const escapeMap = new Map([
  ['<', '['],
  ['>', ']'],
  [':', '-'],
  ['"', "'"],
  ['/', '-'],
  ['\\', '-'],
  ['|', ' '],
  ['?', ' '],
  ['*', ' '],
  ['~', '-'],
])

/**
 * Replace illegal strings in a text for a valid path.
 * @param text The text replaced
 * @returns Replaced string
 */
export const escape = (text: string) => {
  return text
    .replaceAll(invalidRegex, function (match) {
      const replacement = escapeMap.get(match)
      if (typeof replacement === 'undefined') {
        return ''
      }

      return replacement
    })
    .trim()
}

export const useDownload = (downloading: boolean, limit: number, interval = 1000) => {
  const [status, setStatus] = useState(new Map())

  /**
   * An item stack that has pending files.
   */
  const pendingStack: DownloadContext[] = []

  /**
   * An item stack that has downloading files.
   */
  const downloadingStack: Map<number, DownloadContext> = new Map()

  /**
   * An item stack that has files interrupted from downloading.
   */
  const interruptedStack: [DownloadContext, string][] = []

  /**
   * An item stack that has files completed downloading.
   */
  const completedStack: DownloadContext[] = []

  /**
   * Start downloading an item and move it from `pendingStack` to `downloadingStack` if the count of `downloadingStack` is under `limit`.
   */
  const request = async () => {
    if (limit <= downloadingStack.size) {
      return
    }

    const context = pendingStack.pop()
    if (typeof context === 'undefined') {
      return
    }

    try {
      const downloadId = await browser.downloads.download({
        url: context.url,
        filename: context.path,
        saveAs: false,
      })

      if (typeof downloadId === 'undefined') {
        const error = browser.runtime.lastError?.message ?? 'COULD_NOT_START'
        interruptedStack.push([context, error])
        return
      }

      downloadingStack.set(downloadId, context)
    } catch (error) {
      interruptedStack.push([context, String(error)])
      return
    }
  }

  /**
   * Push an item to the pending stack for downloading.
   * @param context The item
   */
  const reserve = (context: DownloadContext) => {
    pendingStack.push(context)
  }

  /**
   * Clear the pending stack and cancel items from downloading.
   */
  const cancel = async function () {
    pendingStack.splice(0)
    for (const downloadId of downloadingStack.keys()) {
      await browser.downloads.cancel(downloadId)
    }
  }

  /**
   * The callback function for the downloading event.
   * @param delta The info about changed properties in `DownloadItem`
   */
  const downloadCallback = async (
    delta: browser.Downloads.OnChangedDownloadDeltaType,
  ) => {
    // If the downloading state is not changed...
    if (typeof delta.state === 'undefined') {
      return
    }

    // If the event is not own...
    const context = downloadingStack.get(delta.id)
    if (typeof context === 'undefined') {
      return
    }

    downloadingStack.delete(delta.id)

    switch (delta.state.current) {
      case 'interrupted': {
        const items = await browser.downloads.search({
          id: delta.id,
        })

        const error = items[0].error ?? 'FAILED'
        interruptedStack.push([context, error])
        break
      }
      case 'complete': {
        completedStack.push(context)
        break
      }
    }

    // Next download
    request()
  }

  useEffect(() => {
    if (!downloading) {
      return
    }

    const timerId = setInterval(request, interval)
    browser.downloads.onChanged.addListener(downloadCallback)

    return () => {
      clearInterval(timerId)
      browser.downloads.onChanged.removeListener(downloadCallback)
    }
  }, [downloading])

  return {
    reserve,
    cancel,
  }
}
