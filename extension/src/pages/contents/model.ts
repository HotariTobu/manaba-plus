import { ScrapingNode } from "./types/scrapingNode";

export const scrapingModelBase: ScrapingNode[] = [
  {
    id: 'news',
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
        id: 'report_attachments',
        urlPrefix: null,
        anchorSelector: '.attachments a',
      },
      {
    id: 'report_submissions',
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
    id: 'page',
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
