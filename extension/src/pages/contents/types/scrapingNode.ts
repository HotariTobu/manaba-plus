interface ScrapingBranchNode {
  id?: string | undefined
  urlPrefix: string
  anchorSelector: string
  children: ScrapingNode[]
}

interface ScrapingLeafNode {
  id?: string | undefined
  urlPrefix: null
  anchorSelector: string
}

export type ScrapingNode = ScrapingBranchNode | ScrapingLeafNode
