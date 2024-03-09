import { classMap } from "../../../../config"
import { Position } from "../types/position";

export const classNames: Record<Position, string> = {
  timetable: classMap.dropzone[1],
  current: classMap.dropzone[2],
  other: classMap.dropzone[3],
  rest: classMap.dropzone[4],
  trash: classMap.dropzone.trash,
}
