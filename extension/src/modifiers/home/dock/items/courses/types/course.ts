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
  url?: string
  /** The course's code */
  code?: string
  /** A source url to the course's icon image */
  icon?: string
  /** The course's title */
  title: string

  /** The course's year */
  year: number
  /** The course's day of a week */
  day?: DayOfWeek
  /** The course's school period */
  period?: {
    start: number
    span: number
  }

  /** True if the course is linked to the other course, otherwise false */
  linked: boolean
  /** The course's remarks */
  remarks?: string
  /** The course's teachers */
  teachers?: string
  /** True if the courses's status is on, otherwise false */
  status: Partial<Record<StatusType, boolean>>
}
