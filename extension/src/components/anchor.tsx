import { AnchorHTMLAttributes, forwardRef } from "react";

export type AnchorProps = {
  href?: string | null | undefined
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(({ href, ...props }, ref) => {
  if (href === null || typeof href === 'undefined') {
    return <a {...props} ref={ref} />
  }
  else {
    return <a href={href} {...props} ref={ref} />
  }
})
