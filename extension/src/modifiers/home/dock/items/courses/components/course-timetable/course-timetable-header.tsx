import { t } from "@/utils/i18n"
import { DayOfWeek } from "../../types/course"

/** Header labels of the timetable */
const headers: Record<DayOfWeek, string> = {
  [DayOfWeek.Monday]: t('home_courses_Monday'),
  [DayOfWeek.Tuesday]: t('home_courses_Tuesday'),
  [DayOfWeek.Wednesday]: t('home_courses_Wednesday'),
  [DayOfWeek.Thursday]: t('home_courses_Thursday'),
  [DayOfWeek.Friday]: t('home_courses_Friday'),
  [DayOfWeek.Saturday]: t('home_courses_Saturday'),
  [DayOfWeek.Sunday]: t('home_courses_Sunday'),
  [DayOfWeek.Count]: '',
}

export const CourseTimetableHeader = (props: {
  startColumn: number
  columnCount: number
}) => (
  <div className="col-start-2 col-end-[-1] row-start-1 row-end-2 grid grid-cols-subgrid">
    {[...Array(props.columnCount).keys()].map(i => {
      const day = props.startColumn + i
      return (
        <div className="p-2 text-center font-bold rounded bg-primary text-primary-foreground" key={day}>
          {headers[day as DayOfWeek]}
        </div>
      )
    })}
  </div>
)
