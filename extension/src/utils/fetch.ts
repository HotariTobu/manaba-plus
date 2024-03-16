// TODO: Use type guards

interface FetchContext {
  /**
   * The request url.
   */
  url: string

  /**
   * The request options.
   */
  options?: RequestInit
}

/**
 * Represents fetching info when success
 */
interface FetchSuccess<T> extends FetchContext {
  /**
   * Fetch result data.
   */
  data: T
}

/**
 * Represents fetching info when an error
 */
interface FetchError extends FetchContext {
  /**
   * The error message.
   */
  message: string
}

/**
 * Represents fetching info.
 */
export type FetchResult<T> = FetchSuccess<T> | FetchError

/**
 * Fetch a text from a specific URL.
 * @param url The target URL
 * @param options The request options
 * @returns Result object of string
 */
export const fetchText = async function (
  url: string,
  options?: RequestInit,
): Promise<FetchResult<string>> {
  const context = {
    url,
    options,
  }

  try {
    const response = await fetch(url, options)
    return {
      ...context,
      data: await response.text(),
    }
  } catch (error) {
    const message = (error as object).toString()
    return {
      ...context,
      message,
    }
  }
}

const domParser = new DOMParser()

/**
 * Fetch a text as a DOM document from a specific URL.
 * The document is injected `base` element and set the URL.
 * @param url The target URL
 * @param options The request options
 * @returns Result object of document
 */
export const fetchDOM = async function (
  url: string,
  options?: RequestInit,
): Promise<FetchResult<Document>> {
  const fetchResult = await fetchText(url, options)
  if ('message' in fetchResult) {
    return fetchResult
  }

  const text = fetchResult.data
  const doc = domParser.parseFromString(text, 'text/html')

  // Set base URL to resolve hyperlinks correctly.
  const base = doc.createElement('base')
  base.href = url
  doc.head.appendChild(base)

  return {
    ...fetchResult,
    data: doc,
  }
}
