import { CSSProperties, DependencyList, HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
import { Collision, Over, UniqueIdentifier, UseDroppableArguments, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  SortableContextProps,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

const sortableZoneDataId = 'sortable-zone'

export const isSortableZoneCollision = (collision: Collision) => {
  const data = collision.data?.droppableContainer?.data?.current
  if (typeof data === 'undefined') {
    return false
  }
  else {
    return sortableZoneDataId in data
  }
}

export const hasSortableZoneData = (over: Over) => {
  const data = over.data.current
  if (typeof data === 'undefined') {
    return false
  }
  else {
    return sortableZoneDataId in data
  }
}

interface SortableColumnProps extends Omit<SortableContextProps, 'id'> {
  containerId: UniqueIdentifier
  growOnly?: boolean
  className?: string
  style?: CSSProperties
  useDroppableProps?: Omit<UseDroppableArguments, 'id'>
  droppableDivProps?: Omit<HtmlHTMLAttributes<HTMLDivElement>, 'className' | 'style'>
}

const useMinSize = (disabled?: boolean, deps?: DependencyList) => {
  const [minWidth, setMinWidth] = useState(0)
  const [minHeight, setMinHeight] = useState(0)

  const ref = useRef<{
    element: HTMLElement | null
    last: {
      width: number
      height: number
    }
  }>({
    element: null,
    last: {
      width: 0,
      height: 0,
    },
  })

  const setNodeRef = (element: HTMLElement | null) => {
    ref.current.element = element
  }

  useEffect(() => {
    const { element, last } = ref.current
    if (disabled === true) {
      last.width = 0
      last.height = 0
      setMinWidth(0)
      setMinHeight(0)
      return
    }

    if (element === null) {
      return
    }

    const { width, height } = element.getBoundingClientRect()

    if (last.width < width) {
      last.width = width
    }
    else {
      setMinWidth(last.width)
    }

    if (last.height < height) {
      last.height = height
    }
    else {
      setMinHeight(last.height)
    }
  }, [disabled, ...(deps ?? [])])

  return {
    setNodeRef,
    minSizeStyle: {
      minWidth,
      minHeight,
    }
  }
}

export const SortableZone = ({ containerId, items, strategy = verticalListSortingStrategy, growOnly = false, className, style, useDroppableProps = {}, droppableDivProps, children, ...props }: SortableColumnProps) => {
  const { data: useDroppableData, ...useDroppableRestProps } = useDroppableProps

  const { setNodeRef: setRef1, minSizeStyle } = useMinSize(!growOnly, [items.length])
  const { setNodeRef: setRef2 } = useDroppable({
    id: containerId,
    disabled: typeof props.disabled === 'boolean' ? props.disabled : props.disabled?.droppable,
    data: {
      [sortableZoneDataId]: null,
      ...useDroppableData
    },
    ...useDroppableRestProps,
  });

  const mergedStyle: CSSProperties = {
    ...minSizeStyle,
    ...style,
  }

  const setRef = (element: HTMLElement | null) => {
    setRef1(element)
    setRef2(element)
  }

  return (
    <SortableContext
      id={String(containerId)}
      items={items}
      strategy={strategy}
      {...props}
    >
      <div className={className} style={mergedStyle} ref={setRef} {...droppableDivProps} >
        {children}
      </div>
    </SortableContext>
  );
}
