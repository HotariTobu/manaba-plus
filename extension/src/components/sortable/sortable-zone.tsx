import { CSSProperties, HtmlHTMLAttributes, useEffect, useRef, useState } from "react";
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

export type SortableColumnProps = {
  containerId: UniqueIdentifier
  growOnlyWidth?: boolean
  growOnlyHeight?: boolean
  className?: string
  style?: CSSProperties
  useDroppableProps?: Omit<UseDroppableArguments, 'id'>
  droppableDivProps?: Omit<HtmlHTMLAttributes<HTMLDivElement>, 'className' | 'style'>
} & Omit<SortableContextProps, 'id'>

const useMinSize = (widthEnabled: boolean, heightEnabled: boolean) => {
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

  const updateMinSize = () => {
    const { element, last } = ref.current
    if (element === null) {
      return
    }

    const { width, height } = element.getBoundingClientRect()

    if (widthEnabled) {
      if (last.width < width) {
        last.width = width
      }
      else {
        setMinWidth(last.width)
      }
    }
    else {
      last.width = 0
      setMinWidth(0)
    }

    if (heightEnabled) {
      if (last.height < height) {
        last.height = height
      }
      else {
        setMinHeight(last.height)
      }
    }
    else {
      last.height = 0
      setMinHeight(0)
    }
  }

  useEffect(() => {
    const { element } = ref.current
    if (element === null) {
      return
    }

    const observer = new ResizeObserver(updateMinSize)
    observer.observe(element)
    return () => observer.unobserve(element)
  }, [widthEnabled, heightEnabled])

  return {
    setNodeRef,
    minSizeStyle: {
      minWidth,
      minHeight,
    }
  }
}

export const SortableZone = ({ containerId, items, strategy = verticalListSortingStrategy, growOnlyWidth = false, growOnlyHeight = false, className, style, useDroppableProps = {}, droppableDivProps, children, ...props }: SortableColumnProps) => {
  const { data: useDroppableData, ...useDroppableRestProps } = useDroppableProps

  const { setNodeRef: setRef1, minSizeStyle } = useMinSize(growOnlyWidth, growOnlyHeight)
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
