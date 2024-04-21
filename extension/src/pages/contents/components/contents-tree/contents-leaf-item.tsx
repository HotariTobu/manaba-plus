import { CheckCircledIcon, ShadowIcon, DownloadIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { ReactNode } from "react"
import { ContentsStatus } from "../../types/contents"
import { ContentsLeafNode } from "../../types/contentsNode"
import { getErrorMessage } from "../../utils/getErrorMessage"
import { ExternalLink } from "@/components/external-link"

export const ContentsLeafItem = (props: {
  label: string
  contentsLeaf: ContentsLeafNode
}) => {
  const icons = {
    excluded: <CheckCircledIcon />,
    pending: <ShadowIcon className="animate-spin" />,
    downloading: <DownloadIcon />,
    interrupted: <CrossCircledIcon className="text-red-400" />,
    completed: <CheckCircledIcon className="text-green-400" />,
  } satisfies Record<ContentsStatus['code'], ReactNode>
  return (
    <div className="hover:bg-primary/20 gap-2 grid grid-cols-[auto_minmax(0,_1fr)_auto] items-center rounded-md">
      <div className="w-9 h-9 flex justify-center items-center">
        {icons[props.contentsLeaf.status.code]}
      </div>
      <ExternalLink href={props.contentsLeaf.url} label={props.label} />
      <div className="text-red-400 me-4">
        {props.contentsLeaf.status.code === 'interrupted' && getErrorMessage(props.contentsLeaf.status.message)}
      </div>
    </div>
  )
}
