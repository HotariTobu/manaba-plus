/**
 * Create an element of a specific icon.
 * @param pathData Data of the icon
 * @param attrs Attributes of svg element
 * @returns An svg element that contains an icon
 */
export const getSvg = (pathData: string, attrs = {}) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', pathData)

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('viewBox', '0 0 24 24')

  for (const [attr, value] of Object.entries(attrs)) {
    svg.setAttribute(attr, String(value))
  }

  svg.appendChild(path)

  return svg
}
