import { defineArrangeMap, defineClassMap, defineIdMap, defineSelectorMap } from "@/types/config"

export const idMap = defineIdMap({
  rightPanel: '',
})

export const arrangeMap = defineArrangeMap({
  arrange: {
    bannerList: {
      selector: '.banner-list > ul',
      className: 'flex flex-wrap justify-between'
    },
  },
  dock: {
    pageBody: {
      selector: '.pagebody',
      className: 'grid grid-cols-1 lg:grid-cols-[1fr_auto]',
    },
    pageHeader: {
      selector: '.pageheader-course',
      className: 'col-span-2',
    },
    leftPanel: {
      selector: '.my-course',
      className: 'flex flex-col'
    },
    rightPanel: {
      selector: '#' + idMap.rightPanel,
      className: 'flex flex-col empty:hidden lg:ms-2'
    },
    draggable: {
      selector: [
        '.memo',
        '.alertlist',
        '.my-infolist',
        '.banner-list',
      ].join(', '),
      className: ''
    },
  },
})

export const selectorMap = defineSelectorMap({
  pageContent: '.my-course',
  selfRegistration: '.my-infolist .help-box',
  // selfRegistration: '#h3-self-registration',
  formerLink: '.my-infolist-tips:not(.my-infolist-kikuzou)',
  droppable: [
    arrangeMap.dock.leftPanel.selector,
    arrangeMap.dock.rightPanel.selector,
  ].join(', ')
})

export const classMap = defineClassMap({
  selfRegistration: {
    container: 'my-infolist my-infolist-tips',
    header: 'my-infolist-header',
    body: 'my-infolist-body',
  },
  editing: ''
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
  const getChildIndex = (child: ChildNode) => {
    const parent = child.parentNode
    if (parent === null) {
      return -1
    }

    const children = Array.from(parent.childNodes)
    const index = children.indexOf(child)
    return index
  }

  const escapeId = (id: string) => {
    return id.replace(/[\s#\.\/&<>"']/g, '-')
  }

  const childIndex = getChildIndex(draggable)
  if (childIndex < 0) {
    return null
  }

  const id = escapeId(draggable.className) + childIndex
  return id
}

export const selectors: Record<string, string> = {
  hideOrMoveAlert: '.alertlist',
  hideOrMoveCenterNews: '.my-infolist-centernews',
  hideOrMoveBulkQuery: '.my-infolist-bulkquery',
  hideOrMoveSyllabus: '.my-infolist-searchall',
  hideOrMoveAssignment: '.my-infolist-event',
  hideOrMoveFormerLink: '.my-infolist-tips:not(.my-infolist-kikuzou)',
  hideOrMoveKikuzou: '.my-infolist-kikuzou',
  hideOrMoveBannerList: '.banner-list',

  SelfRegistration: '#h3-self-registration',
}
