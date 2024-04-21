import { Truncated } from "@/components/truncated"
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon } from "@radix-ui/react-icons"

export const ContentsLink = (props: {
  href: string
  label: string
}) => (
  <Button className="w-fit max-w-full text-foreground group" variant="link" asChild>
    <a href={props.href} target="_blank" rel="noopener noreferrer">
      <Truncated text={props.label} />
      <ExternalLinkIcon className="ms-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  </Button>
)
