import { PropsWithChildren } from "react";

export const Trash = (props: PropsWithChildren<{
  visible: boolean
}>) => {
  if (props.visible) {
    return (
      <div className='opacity-50' >
        {props.children}
      </div>
    )
  }
}
