import { makeSafeAsync } from "./makeSafe"

const domParser = new DOMParser()

/**
 * Fetch a text from a specific URL.
 * This function can throw an error.
 * @param url The target URL
 * @param options The request options
 * @returns The response text
 */
export const unsafeFetchText = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)
  return await response.text()
}

/**
 * Fetch a text from a specific URL.
 * @param url The target URL
 * @param options The request options
 * @returns A safe object of the response text
 */
export const safeFetchText = makeSafeAsync(unsafeFetchText)

/**
 * Fetch a text as a DOM document from a specific URL.
 * The document is injected `base` element and set the URL.
 * This function can throw an error.
 * @param url The target URL
 * @param options The request options
 * @returns The document
 */
export const unsafeFetchDOM = async (url: string, options?: RequestInit) => {
  const text = await unsafeFetchText(url, options)
  const doc = domParser.parseFromString(text, 'text/html')

  // Set base URL to resolve hyperlinks correctly.
  const base = doc.createElement('base')
  base.href = url
  doc.head.appendChild(base)

  return doc
}

/**
 * Fetch a text as a DOM document from a specific URL.
 * The document is injected `base` element and set the URL.
 * @param url The target URL
 * @param options The request options
 * @returns A safe object of the document
 */
export const safeFetchDOM = makeSafeAsync(unsafeFetchDOM)
