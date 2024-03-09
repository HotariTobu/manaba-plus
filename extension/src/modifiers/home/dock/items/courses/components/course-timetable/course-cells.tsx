import { fromNumber } from "../../types/coordinate"
import { Course } from "../../types/course"
import { CourseCell } from "./course-cell"

export const CourseCells = (props: {
  coordinateMap: Map<number, Course>
  startColumn: number
  startRow: number
  sortable: boolean
}) => {
  console.log(props.coordinateMap)
  return (
    <>
      {Array.from(props.coordinateMap).map(([coordinate, course]) => {
        const { column, row } = fromNumber(coordinate)
        return (
          <CourseCell column={column - props.startColumn} row={row - props.startRow} span={1} course={course} sortable={props.sortable} coordinate={coordinate} key={coordinate} />
        )
      })}
    </>
  )
}
