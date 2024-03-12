import { SortableItem } from "@/components/sortable/sortable-item"
import { defineCustomSortableData } from "@/utils/defineCustomSortableData"

export type DisabledAt = (coordinate: number) => boolean

interface DroppableCellData {
  coordinate: number
}

export const [droppableCellDataId, createDroppableCellData, getDroppableCellData] = defineCustomSortableData<DroppableCellData>()

/** Droppable node for determining where a course is inserted into */
export const DroppableCell = (props: DroppableCellData & {
  column: number
  row: number
}) => (
  <SortableItem className='cursor-auto' data={createDroppableCellData(props)} item={{
    id: `${droppableCellDataId}-${JSON.stringify(props.coordinate)}`,
  }} disabled={{
    draggable: true,
  }} style={{
    gridColumnStart: props.column + 1,
    gridRowStart: props.row + 1,
  }} />
)