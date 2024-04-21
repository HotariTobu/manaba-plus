import { z } from "zod";
import { ScrapingNode } from "./types/scrapingNode";

const scrapingNodeIdSchema = z.enum([
  'news',
  'report_attachments',
  'report_submissions',
  'page',
])
export type ScrapingNodeId = z.infer<typeof scrapingNodeIdSchema>
export const scrapingNodeIdEnum = scrapingNodeIdSchema.enum

const scrapingModelBase: ScrapingNode[] = [
  {
    id: scrapingNodeIdEnum.news,
    urlPrefix: '_news',
    anchorSelector: '.newstext a',
    children: [
      {
        urlPrefix: null,
        anchorSelector: '.file + .inlineaf-description a',
      },
    ]
  },
  {
    urlPrefix: '_report',
    anchorSelector: '.report-title a',
    children: [
      {
        id: scrapingNodeIdEnum.report_attachments,
        urlPrefix: null,
        anchorSelector: '.attachments a',
      },
      {
        id: scrapingNodeIdEnum.report_submissions,
        urlPrefix: '',
        anchorSelector: 'a[href*="collectiondetail"]',
        children: [
          {
            urlPrefix: '',
            anchorSelector: '.contentslist a',
            children: [
              {
                urlPrefix: null,
                anchorSelector: '.report-submit-list a:not(.zoom-off)'
              }
            ]
          },
        ]
      },
    ]
  },
  {
    id: scrapingNodeIdEnum.page,
    urlPrefix: '_page',
    anchorSelector: '.about-contents a',
    children: [
      {
        urlPrefix: '',
        anchorSelector: '.contentslist a',
        children: [
          {
            urlPrefix: null,
            anchorSelector: '.file + .inlineaf-description a'
          }
        ]
      },
    ]
  },
]

/**
 * Create a scraping model from a set of scraping node ids.
 * @param ignoreSet The set of id to thin out the scraping tree
 * @returns A scraping model along the id set
 */
export const getScrapingModel = (ignoreSet: Set<ScrapingNodeId>) => {
  const thinOut = (nodes: ScrapingNode[]): ScrapingNode[] => nodes
    .filter(node => {
      const parseResult = scrapingNodeIdSchema.safeParse(node.id)
      if (parseResult.success && ignoreSet.has(parseResult.data)) {
        return false
      }
      else {
        return true
      }
    })
    .map(node => {
      if (node.urlPrefix === null) {
        return node
      }
      else {
        return {
          ...node,
          children: thinOut(node.children)
        }
      }
    })
  return thinOut(scrapingModelBase)
}
