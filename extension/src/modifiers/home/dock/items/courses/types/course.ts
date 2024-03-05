export enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
  Count,
}

export const days: readonly number[] = [...new Array(DayOfWeek.Count).keys()]

export enum StatusType {
  News,
  Assignment,
  Grade,
  Topic,
  Collection,
}

export interface Course {
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
  year: number | null

  /** True if the course is linked to the other course, otherwise false */
  linked: boolean
  /** The course's remarks */
  remarks: string | null
  /** The course's teachers */
  teachers: string | null
  /** True if the courses's status is on, otherwise false */
  status: Partial<Record<StatusType, boolean>>
}
