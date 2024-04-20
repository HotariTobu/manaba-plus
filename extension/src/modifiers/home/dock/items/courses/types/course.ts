export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const
export type DayOfWeek = (typeof daysOfWeek)[number]

export const statusTypes = [
  'news',
  'assignment',
  'grade',
  'topic',
  'collection',
] as const
export type StatusType = (typeof statusTypes)[number]

export type Course = {
  /** A string to identify the course */
  id: string

  /** The url to the course page */
  url: string | null
  /** The course's code */
  code: string | null
  /** A source url to the course's icon image */
  icon: string | null
  /** The course's title */
  title: string

  /** The course's year */
  year: number

  /** True if the course is linked to the other course, otherwise false */
  linked: boolean
  /** The course's remarks */
  remarks: string | null
  /** The course's teachers */
  teachers: string | null
  /** True if the courses's status is on, otherwise false */
  status: Partial<Record<StatusType, boolean>>
}
