import { useEffect, useRef, useState } from "react"

export const useSortableFocus = () => {
  const [focus, setFocus] = useState(false)
  const ref = useRef({
    element: null as HTMLElement | null,
    // innerFlag: false,
  })

  const focusOn = () => {
    setFocus(true)
  }

  const focusOff = () => {
    setFocus(false)
  }

  // const handleEnter = () => {
  //   ref.current.innerFlag = true
  // }

  // const handleLeave = () => {
  //   if (ref.current.innerFlag) {
  //     ref.current.innerFlag = false;
  //   } else {
  //     setFocus(false)
  //   }
  // }

  // const handleOver = () => {
  //   if (ref.current.innerFlag) {
  //     ref.current.innerFlag = false
  //     setFocus(true)
  //   }
  // }

  useEffect(() => {
    const { element } = ref.current
    if (element === null) {
      return
    }

    // element.addEventListener('pointerenter', handleEnter)
    // element.addEventListener('pointerleave', handleLeave)
    // element.addEventListener('pointerover', handleOver)

    element.addEventListener('pointerenter', focusOn)
    element.addEventListener('pointerleave', focusOff)
    element.addEventListener('focusin', focusOn)
    element.addEventListener('focusout', focusOff)

    return () => {
      // element.removeEventListener('pointerenter', handleEnter)
      // element.removeEventListener('pointerleave', handleLeave)
      // element.removeEventListener('pointerover', handleOver)

      element.removeEventListener('pointerenter', focusOn)
      element.removeEventListener('pointerleave', focusOff)
      element.removeEventListener('focusin', focusOn)
      element.removeEventListener('focusout', focusOff)
    }
  }, [])

  const setNodeRef = (element: HTMLElement | null) => {
    ref.current.element = element
  }

  return {
    focus,
    setNodeRef,
  }
}
