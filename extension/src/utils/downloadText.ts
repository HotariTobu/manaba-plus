import { c } from "./element";

/**
 * Download a text file.
 * @param filename The filename
 * @param text The content text
 */
export const downloadText = (filename: string, text: string) => {
  const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  const anchor = c('a', {
    href: dataUrl,
    download: filename,
  })
  anchor.click();
}
