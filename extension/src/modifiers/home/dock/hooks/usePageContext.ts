import { createContext, useContext } from "react"

export type PageStatus = 'normal' | 'editing-dock' | 'editing-timetable'

export const PageContext = createContext<PageStatus>('normal')
export const PageSetterContext = createContext<(status: PageStatus) => void>(() => { })

export const usePageContext = () => {
  const status = useContext(PageContext)
  const setStatus = useContext(PageSetterContext)

  return {
    status,
    setStatus,
  }
}
