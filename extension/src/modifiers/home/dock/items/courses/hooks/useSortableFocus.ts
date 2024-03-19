import { useEffect, useRef, useState } from "react"

export const useSortableFocus = () => {
  const [focus, setFocus] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (element === null) {
      return
    }

    const h = (e: PointerEvent) => console.log(e.type, e.target.tagName)

    // element.addEventListener('pointercancel', h)
    // element.addEventListener('pointerdown', h)
    element.addEventListener('pointerenter', h)
    element.addEventListener('pointerleave', h)
    // element.addEventListener('pointermove', h)
    element.addEventListener('pointerout', h)
    element.addEventListener('pointerover', h)
    // element.addEventListener('pointerup', h)

    return () => {
      element.removeEventListener('pointercancel', h)
      element.removeEventListener('pointerdown', h)
      element.removeEventListener('pointerenter', h)
      element.removeEventListener('pointerleave', h)
      element.removeEventListener('pointermove', h)
      element.removeEventListener('pointerout', h)
      element.removeEventListener('pointerover', h)
      element.removeEventListener('pointerup', h)
    }
  }, [])

  const setNodeRef = (element: HTMLElement | null) => {
    ref.current = element
  }

  return {
    focus,
    setNodeRef,
  }
}
