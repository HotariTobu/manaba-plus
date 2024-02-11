// https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/

const urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator

  /**
   * Check a string is a valid url.
   * @param urlString The string
   * @returns True if the string is a valid url, otherwise false
   */
export const isValidUrl = (urlString: string) => {
  return urlPattern.test(urlString);
}
