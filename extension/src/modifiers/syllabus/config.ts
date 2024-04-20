import { ClassMap, SelectorMap } from "@/types/config"

export const selectorMap = {
  selfRegistrationContainer: '.articlebody',
} satisfies SelectorMap

export const classMap = {
  selfRegistrationAnchor: 'block my-2',
} satisfies ClassMap

/**
 * Convert a syllabus url into a self-registration url.
 * @param rootUrl The syllabus url
 * @returns The self-registration url, or null if a course code is not found
 */
export const getSelfRegistrationUrl = (syllabusUrl: string) => {
  // Extract the course code.
  const match = /(.+)syllabus_(\d+)/.exec(syllabusUrl)
  if (match === null) {
    return
  }

  return `${match[1]}home_selfregistration_${match[2]}`
}
