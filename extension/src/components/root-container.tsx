import { PropsWithChildren } from 'react'
import rootClass from '@/root-class.json'

export const RootContainer = (props: PropsWithChildren) => (
  <div className={rootClass} style={{ display: 'contents' }}>
    {props.children}
  </div>
)
