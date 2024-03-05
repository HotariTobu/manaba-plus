import { PropsWithChildren } from "react";

export const Trash = ({hidden, ...props}: PropsWithChildren<{
  hidden: boolean
}>) => {
  if (hidden) {
    return
  }

  return (
    <div className='opacity-50' {...props} />
  )
}
