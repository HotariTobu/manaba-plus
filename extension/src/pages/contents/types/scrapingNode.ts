interface ScrapingBranchNode {
  urlPrefix: string
  anchorSelector: string
  children: ScrapingNode[]
}

interface ScrapingLeafNode {
  urlPrefix: null
  anchorSelector: string
}

export type ScrapingNode = ScrapingBranchNode | ScrapingLeafNode
