import { defineArrangeMap, defineClassMap, defineIdMap, defineSelectorMap } from "@/types/config"

export const idMap = defineIdMap({
  // rightPanel: '',
})

export const arrangeMap = defineArrangeMap({
  contents: {
    notes: {
      selector: '.coursememo',
      className: 'min-h-4 p-2 m-0 rounded overflow-hidden'
    },
    alertList: {
      selector: '.alertlist div',
      className: 'm-0'
    },
    myInfoList: {
      container: {
        selector: '.my-infolist',
        className: 'border border-primary border-solid rounded overflow-hidden'
      },
      children: {
        selector: '.my-infolist *',
        className: 'm-0 p-0 bg-none'
      },
      header: {
        div: {
          selector: '.my-infolist-header',
          className: 'bg-primary flex items-center h-fit p-0 border-none'
        },
        h2: {
          selector: '.my-infolist-header h2',
          className: 'm-2 p-0'
        }
      },
      body: {
        selector: '.my-infolist-body',
        className: 'm-2 h-fit border-none'
      },
      others: {
        search: {
          form: {
            selector: '.newssearch-box form',
            className: 'gap-1 flex'
          },
          textBox: {
            selector: '.newssearch-box [name="search"]',
            className: 'px-1 w-full'
          }
        },
        details: {
          selector: [
            '.showmore',
            '[style*="text-align:right"]:not(:has(input))',
            '[style*="padding-top:5px"]',
            '.right:has(img+a) :is(li)',
          ].join(', '),
          className: 'pt-2 h-fit'
        },
        subHeader: {
          selector: '.my-infolist-body h3',
          className: 'mb-2 indent-0'
        },
        eventList: {
          date: {
            selector: '.center.eventlist-day',
            className: 'pe-1'
          },
          anchors: {
            selector: '.event-title a',
            className: 'inline'
          }
        },
        kikuzou: {
          container: {
            selector: '.my-infolist-kikuzou table',
            className: 'w-full'
          },
          banners: {
            selector: '.my-infolist-kikuzou tr:has(.right > a)',
            className: 'flex justify-evenly'
          }
        }
      }
    },
    bannerList: {
      container: {
        selector: '.banner-list ul',
        className: 'flex justify-evenly flex-wrap text-[0]'
      },
      children: {
        listItems: {
          selector: '.banner-list li',
          className: 'block p-0'
        }
      }
    }
  }
  // arrange: {
  //   bannerList: {
  //     selector: '.banner-list > ul',
  //     className: 'flex flex-wrap justify-between'
  //   },
  // },
  // dock: {
  //   pageBody: {
  //     selector: '.pagebody',
  //     className: 'grid grid-cols-1 lg:grid-cols-[1fr_auto]',
  //   },
  //   pageHeader: {
  //     selector: '.pageheader-course',
  //     className: 'col-span-2',
  //   },
  //   leftPanel: {
  //     selector: '.my-course',
  //     className: 'flex flex-col'
  //   },
  //   rightPanel: {
  //     selector: '#' + idMap.rightPanel,
  //     className: 'flex flex-col empty:hidden lg:ms-2'
  //   },
  //   draggable: {
  //     selector: [
  //       '.memo',
  //       '.alertlist',
  //       '.my-infolist',
  //       '.banner-list',
  //     ].join(', '),
  //     className: ''
  //   },
  // },
})

export const selectorMap = defineSelectorMap({
  pageBody: '.pagebody',
  pageElements: {
    top: [
      '.pageheader-course',
      '.memo',
      '.alertlist',
    ].join(', '),
    left: '.contentbody-left .my-infolist:not(.my-infolist-mycourses)',
    right: [
      '.contentbody-right .my-infolist',
      '.banner-list',
    ].join(', '),
    bottom: '',
  }

  // pageContent: '.my-course',
  // selfRegistration: '.my-infolist .help-box',
  // // selfRegistration: '#h3-self-registration',
  // formerLink: '.my-infolist-tips:not(.my-infolist-kikuzou)',
  // droppable: [
  //   arrangeMap.dock.leftPanel.selector,
  //   arrangeMap.dock.rightPanel.selector,
  // ].join(', ')
})

export const classMap = defineClassMap({
  // selfRegistration: {
  //   container: 'my-infolist my-infolist-tips',
  //   header: 'my-infolist-header',
  //   body: 'my-infolist-body',
  // },
  // editing: ''
})

/**
 * Convert a home url into a root url.
 * @param rootUrl The home url
 * @returns The root url
 */
export const getRootUrl = (homeUrl: string) => {
  const match = /(.+?)home.*/.exec(homeUrl)
  if (match === null) {
    return null
  }
  return match[1]
}

export const getDraggableId = (draggable: Element) => {
  // const getChildIndex = (child: ChildNode) => {
  //   const parent = child.parentNode
  //   if (parent === null) {
  //     return -1
  //   }

  //   const children = Array.from(parent.childNodes)
  //   const index = children.indexOf(child)
  //   return index
  // }

  // const escapeId = (id: string) => {
  //   return id.replace(/[\s#\.\/&<>"']/g, '-')
  // }

  // const childIndex = getChildIndex(draggable)
  // if (childIndex < 0) {
  //   return null
  // }

  // const id = escapeId(draggable.className) + childIndex
  // return id
}

export const selectors: Record<string, string> = {
  // hideOrMoveAlert: '.alertlist',
  // hideOrMoveCenterNews: '.my-infolist-centernews',
  // hideOrMoveBulkQuery: '.my-infolist-bulkquery',
  // hideOrMoveSyllabus: '.my-infolist-searchall',
  // hideOrMoveAssignment: '.my-infolist-event',
  // hideOrMoveFormerLink: '.my-infolist-tips:not(.my-infolist-kikuzou)',
  // hideOrMoveKikuzou: '.my-infolist-kikuzou',
  // hideOrMoveBannerList: '.banner-list',

  // SelfRegistration: '#h3-self-registration',
}
