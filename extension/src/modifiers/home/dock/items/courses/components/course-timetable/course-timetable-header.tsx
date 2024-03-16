import { t } from "@/utils/i18n"
import { daysOfWeek } from "../../types/course"

export const CourseTimetableHeader = (props: {
  startColumn: number
  columnCount: number
}) => (
  <div className="col-start-2 col-end-[-1] row-start-1 row-end-2 grid grid-cols-subgrid">
    {[...Array(props.columnCount).keys()].map(i => {
      const day = props.startColumn + i
      return (
        <div className="p-2 text-center font-bold rounded-md bg-primary text-primary-foreground" key={day}>
          {t(`home_courses_${daysOfWeek[day]}`)}
        </div>
      )
    })}
  </div>
)
