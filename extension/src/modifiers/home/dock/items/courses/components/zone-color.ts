import { classMap } from "../../../../config"
import { Position } from "../types/position";

export const classNames: Record<Position, string> = {
  main: classMap.dropzone[1],
  other: classMap.dropzone[4],
  trash: classMap.dropzone.trash,
}
