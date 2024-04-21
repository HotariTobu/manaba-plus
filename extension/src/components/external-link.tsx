import { Truncated } from "@/components/truncated"
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { Anchor, AnchorProps } from "./anchor"
import { cn } from "@/lib/utils"

export const ExternalLink = ({ label, className, ...props }: {
  label: string
} & Omit<AnchorProps, 'children'>) => (
  <Button className={cn("p-0 w-fit max-w-full gap-1 grid grid-cols-[minmax(0,_1fr)_auto] text-foreground group", className)} variant="link" asChild>
    <Anchor target="_blank" rel="noopener noreferrer" {...props}>
      <Truncated text={label} />
      <ExternalLinkIcon className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4" />
    </Anchor>
  </Button>
)
