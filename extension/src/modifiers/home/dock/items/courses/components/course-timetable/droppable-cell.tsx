import { SortableItem } from "@/components/sortable/sortable-item"
import { createCustomDnDData } from "@/utils/defineCustomDnDData"

export type DisabledAt = (coordinate: number) => boolean

type DroppableCellData = {
  coordinate: number
}

export const [droppableCellDataId, createDroppableCellData, getDroppableCellData] = createCustomDnDData<DroppableCellData>()

/** Droppable node for determining where a course is inserted into */
export const DroppableCell = (props: DroppableCellData & {
  column: number
  row: number
  sortable: boolean
}) => (
  <SortableItem className='cursor-auto' data={createDroppableCellData(props)} item={{
    id: `${droppableCellDataId}-${JSON.stringify(props.coordinate)}`,
  }} disabled={{
    draggable: true,
    droppable: !props.sortable,
  }} style={{
    gridColumnStart: props.column + 1,
    gridRowStart: props.row + 1,
  }} />
)
