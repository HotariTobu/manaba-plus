import { SortableItem } from "@/components/sortable/sortable-item"
import { cn } from "@/lib/utils"
import { defineCustomSortableData } from "@/utils/defineCustomSortableData"

export type DisabledAt = (coordinate: number) => boolean

interface DroppableCellData {
  term: string
  coordinate: number
  disabledAt: DisabledAt
}

export const [droppableCellDataId, createDroppableCellData, getDroppableCellData] = defineCustomSortableData<DroppableCellData>()

/** Droppable node for determining where a course is inserted into */
export const DroppableCell = (props: DroppableCellData & {
  column: number
  row: number
}) => {
  const item = {
    id: `${droppableCellDataId}-${JSON.stringify(props.coordinate)}`,
  }

  const className = () => {
    debug: {
      return "bg-blue-200 text-xl flex justify-center items-center"
    }
  }

  return (
    <SortableItem className={cn('cursor-auto', className())} item={item} data={createDroppableCellData(props)} disabled={{
      draggable: true,
    }} style={{
      gridColumnStart: props.column + 1,
      gridRowStart: props.row + 1,
    }}>
      {props.coordinate}
    </SortableItem>
  )
}
