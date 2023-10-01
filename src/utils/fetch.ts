/**
 * Represents fetching info.
 */
export interface FetchResult<T> {
  /**
   * The request url.
   */
  url: string

  /**
   * The request options.
   */
  options?: RequestInit

  /**
   * Fetch result data.
   * Undefined when some error occurred.
   */
  data?: T

  /**
   * True when an error has occurred, otherwise false.
   */
  error: boolean

  /**
   * The error message.
   * Undefined when any error did not occur.
   */
  message?: string
}

/**
 * Fetch a text from a specific URL.
 * @param url The target URL
 * @param options The request options
 * @returns Result object of string
 */
export const fetchText = async function (
  url: string,
  options?: RequestInit
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
      error: false,
    }
  } catch (error) {
    const message = (error as object).toString()
    return {
      ...context,
      error: true,
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
  options?: RequestInit
): Promise<FetchResult<Document>> {
  const fetchResult = await fetchText(url, options)
  if (fetchResult.error) {
    return {
      ...fetchResult,
      data: null,
    }
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
