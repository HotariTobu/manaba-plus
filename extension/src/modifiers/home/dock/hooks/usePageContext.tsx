import { PropsWithChildren, createContext, useContext, useState } from "react"

export type PageStatus = 'normal' | 'editing-dock' | 'editing-courses' | 'editing-assignments'
export type SetPageStatus = (status: PageStatus) => void

export const PageContext = createContext<PageStatus>('normal')
export const PageSetterContext = createContext<SetPageStatus>(() => { })

type ProviderProps = {
  status: PageStatus,
  setStatus: SetPageStatus,
}

const Provider = (props: PropsWithChildren & ProviderProps) => (
  <PageContext.Provider value={props.status} >
    <PageSetterContext.Provider value={props.setStatus}>
      {props.children}
    </PageSetterContext.Provider>
  </PageContext.Provider>
)

export const usePageContextProvider = () => {
  const [status, setStatus] = useState<PageStatus>('normal')

  return {
    Provider,
    providerProps: {
      status,
      setStatus,
    }
  }
}

export const usePageContext = () => {
  const status = useContext(PageContext)
  const setStatus = useContext(PageSetterContext)

  return {
    status,
    setStatus,
  }
}
