import { ScrapingNode } from "./types/scrapingNode";

export const model: ScrapingNode[] = [
  {
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
        urlPrefix: null,
        anchorSelector: '.attachments a',
      },
      {
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
