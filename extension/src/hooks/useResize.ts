import { useEffect, useRef } from "react"

export const useResize = (callback: ResizeObserverCallback, disabled?: boolean) => {
    const ref = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (disabled === true) {
            return
        }

        const element = ref.current
        if (element === null) {
            return
        }

        const observer = new ResizeObserver(callback)
        observer.observe(element)
        return () => observer.unobserve(element)
    }, [callback, disabled])

    const setRef = (element: HTMLElement | null) => {
        ref.current = element
    }

    return {
        setRef
    }
}