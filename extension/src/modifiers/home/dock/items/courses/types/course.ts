export enum DayOfWeek {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

export enum StatusType {
  NEWS,
  ASSIGNMENT,
  GRADE,
  TOPIC,
  COLLECTION,
}

export interface Course {
  id: string

  url: string | null
  code: string | null
  icon: string | null
  title: string

  year: number
  day: DayOfWeek | null
  period: {
    start: number
    span: number
  } | null

  linked: boolean
  remarks: string | null
  teachers: string | null
  status: Partial<Record<StatusType, boolean>>
}
