import { CheckCircledIcon, ShadowIcon, DownloadIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { ReactNode } from "react"
import { ContentsStatus } from "../../types/contents"
import { ContentsLink } from "./contents-link"
import { ContentsLeafNode } from "../../types/contentsNode"

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
    <div className="hover:bg-primary/20 flex items-center rounded-md">
      <div className="w-9 h-9 flex justify-center items-center">
        {icons[props.contentsLeaf.status.code]}
      </div>
      <ContentsLink href={props.contentsLeaf.url} label={props.label} />
      {props.contentsLeaf.status.code === 'interrupted' && (
        <div className="ms-auto text-red-400">{props.contentsLeaf.status.message}</div>
      )}
    </div>
  )
}
