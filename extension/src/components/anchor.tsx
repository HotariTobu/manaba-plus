import { HTMLAttributes, forwardRef } from "react";

interface AnchorProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string | null | undefined
}

export const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(({ href, ...props }, ref) => {
  if (href === null || typeof href === 'undefined') {
    return <a {...props} ref={ref} />
  }
  else {
    return <a href={href} {...props} ref={ref} />
  }
})
