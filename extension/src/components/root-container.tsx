import { PropsWithChildren } from 'react'
import rootClass from '@/root-class.json'

export const RootContainer = (props: PropsWithChildren) => (
  <div className={rootClass}>
    {props.children}
  </div>
)
