export enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export enum StatusType {
  News,
  Assignment,
  Grade,
  Topic,
  Collection,
}

export interface Course {
  id: string

  url?: string
  code?: string
  icon?: string
  title: string

  year: number
  day?: DayOfWeek
  period?: {
    start: number
    span: number
  }

  linked: boolean
  remarks?: string
  teachers?: string
  status: Partial<Record<StatusType, boolean>>
}
