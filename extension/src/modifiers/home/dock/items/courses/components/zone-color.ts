import { classMap } from "../../../../config"
import { Position } from "../types/position";

export const classNames: Record<Position, string> = {
  main: classMap.dropzone[1],
  other: classMap.dropzone[2],
  rest: classMap.dropzone[3],
  trash: classMap.dropzone.trash,
}
