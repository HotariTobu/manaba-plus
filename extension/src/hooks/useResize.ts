import { useEffect, useRef } from "react"

export const useResize = (callback: (element: HTMLElement) => void, disabled?: boolean) => {
    const ref = useRef<HTMLElement | null>(null)

    const getNodeRef = () => {
        return ref.current
    }

    const setNodeRef = (element: HTMLElement | null) => {
        ref.current = element
    }

    useEffect(() => {
        if (disabled === true) {
            return
        }

        const element = ref.current
        if (element === null) {
            return
        }

        const observer = new ResizeObserver(() => callback(element))
        observer.observe(element)
        return () => observer.unobserve(element)
    }, [callback, disabled])

    return {
        getNodeRef,
        setNodeRef,
    }
}
