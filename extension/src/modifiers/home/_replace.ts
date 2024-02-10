import getOptions from '@/schemas/options'
import { fetchDOM } from '@/utils/fetch'
import '@/extensions/element'

const replaceContentBody = function () {
  const mycourse = document.querySelector('.my-course')
  const contentBody = document.createElement('div')
  if (mycourse === null || contentBody === null) {
    return
  }

  contentBody.id = 'content-body'

  const contentbodyLeft = document.querySelector('.contentbody-left')
  if (contentbodyLeft !== null) {
    contentbodyLeft.className = 'left'
    contentBody.appendChild(contentbodyLeft)
  }

  const contentbodyRight = document.querySelector('.contentbody-right')
  if (contentbodyRight !== null) {
    contentbodyRight.className = 'right'
    contentBody.appendChild(contentbodyRight)
  }

  mycourse.appendChild(contentBody)
}

const replaceFormerLink = async function () {
  const { options } = await getOptions()

  const id =
    options.home['visibility-and-movement']['hide-or-move-former-link'].id
  const container = document.getElementById(id)
  if (container === null) {
    return
  }

  const selfRegistrationItem = container.querySelector('#h3-self-registration')
    ?.parentElement
  if (
    selfRegistrationItem === null ||
    typeof selfRegistrationItem === 'undefined'
  ) {
    return
  }

  selfRegistrationItem.remove()

  const sidePanel = container.parentElement

  const clone = container.cloneNode(true) as HTMLElement
  clone.id =
    options.home['visibility-and-movement']['hide-or-move-self-registration'].id

  sidePanel?.insertBefore(clone, container)

  clone.querySelector('.tips-list')?.replaceChildren(selfRegistrationItem)
}

/**
 * Extract attribute value from an element and create an element.
 * @param source The source element or the parent element and query selectors
 * @param className The class attribute value of the new element
 * @param tagName The tag name of the new element
 * @param attributeNames The name of the attribute copied
 * @returns The new element
 */
const getContent = function (
  source: Element | { parent: Element; selectors: string } | null,
  className: string,
  tagName = 'div',
  attributeNames: string | string[] = 'textContent',
) {
  if (source !== null && !(source instanceof Element)) {
    const { parent, selectors } = source
    source = parent?.querySelector(selectors) ?? null
  }

  if (source === null) {
    return null
  }

  const target = document.createElement(tagName)
  target.className = className

  if (typeof attributeNames === 'string') {
    attributeNames = [attributeNames]
  }

  for (const attributeName of attributeNames) {
    if (attributeName in source && attributeName in target) {
      const attribute = source.getAttribute(attributeName)
      if (attribute !== null) {
        target.setAttribute(attributeName, attribute)
      }
    }
  }

  return target
}

/**
 * Suffixes of URLs related to status icons.
 */
const statusSuffix = [
  '_news',
  '',
  '_grade',
  '_topics',
  '_coursecollection_user',
]

/**
 * Extract the title and status icons from a course item.
 * @param course The course item
 * @returns title: The element that has the course title
 * @returns status: The container of the status icons
 */
const getTitleAndStatus = function (course: Element) {
  const anchor = getContent(
    {
      parent: course,
      selectors:
        '.course-cell a:first-of-type, .courselist-title a, .course-card-title a',
    },
    '',
    'a',
    ['href', 'textContent'],
  ) as HTMLAnchorElement
  if (anchor === null) {
    return { title: null, status: null }
  }

  const courseUrl = anchor.href

  const title = document.createElement('div')
  title.className = 'title'
  title.appendChild(anchor)

  const pastStatus = course.querySelector('.coursestatus, .course-card-status')
  if (pastStatus === null) {
    return { title, status: null }
  }

  const children = Array.from(pastStatus.children)

  // If a link state of the course exists, append it to the title element.
  let linkState: Element | null = getContent(
    {
      parent: course,
      selectors: 'span[style]',
    },
    'link-state',
  )
  if (children[0].className === 'registration-state') {
    const otherLinkState = children.shift()
    if (typeof otherLinkState !== 'undefined') {
      otherLinkState.className = 'link-state'
      linkState = otherLinkState
    }
  }
  linkState?.joinIn(title)

  const status = document.createElement('div')
  status.className = 'status'

  const newChildren: HTMLAnchorElement[] = []

  for (let index = 0; index < children.length; index++) {
    const newChild = document.createElement('a')
    newChild.href = courseUrl + statusSuffix[index]
    newChild.appendChild(children[index])
    newChildren.push(newChild)
    status.appendChild(newChild)
  }

  // Set assignment link.
  const img = children[1] as HTMLImageElement
  if (img.src.endsWith('on.png')) {
    fetchDOM(courseUrl).then(function (fetchResult) {
      if ('message' in fetchResult) {
        return
      }

      const doc = fetchResult.data
      const menus = doc.querySelectorAll(
        '.course-menu-query, .course-menu-report, .course-menu-survey',
      )
      for (const menu of menus) {
        const counter = menu.querySelector('.my-unreadcount')
        if (counter === null) {
          continue
        }

        const menuAnchor = menu.querySelector('a')
        if (menuAnchor !== null) {
          newChildren[1].href = menuAnchor.href
        }
        break
      }
    })
  }

  return { title, status }
}

/**
 * Get the course components from an element.
 * @param course The course element that new elements are made from
 * @returns An object that has the new elements in
 */
const getComponents = function (course: Element) {
  const { title, status } = getTitleAndStatus(course)

  const star = document.createElement('div')
  star.className = 'star'

  const actions = document.createElement('div')
  actions.className = 'actions'
  star?.joinIn(actions)

  return { title, actions, status }
}

/**
 * Get a year and a remarks element from a course element.
 * @param course The course element that can have the year and the remarks info
 * @returns An object that has the new elements in
 */
const getYearAndRemarks = function (course: Element) {
  const element = course.querySelector<HTMLElement>(
    '.courseitemdetail:first-of-type',
  )

  let yearStr = ''
  let remarksStr = ''

  // Extract year and remarks from `textContent`.
  const match = /(\d{4})(.*)/.exec(element?.textContent ?? '')
  if (match !== null) {
    yearStr = match[1]
    remarksStr = match[2].trim()
  }

  const year = document.createElement('div')
  year.className = 'year'
  year.textContent = yearStr

  const remarks = document.createElement('div')
  remarks.className = 'remarks'
  remarks.textContent = remarksStr

  return { year, remarks }
}

/**
 * Replace the course elements with new components.
 */
const replaceCourses = function () {
  // #region cell type
  document
    .querySelectorAll<HTMLTableCellElement>('.course-cell')
    .forEach(function (pastCell) {
      const cell = document.createElement('td')
      cell.className = 'has-course'
      cell.rowSpan = pastCell.rowSpan

      const container = document.createElement('div')
      container.className = 'container'

      for (const pastCourse of pastCell.children) {
        const { title, actions, status } = getComponents(pastCourse)

        const course = document.createElement('div')
        course.className = 'course cell'
        title?.joinIn(course)
        course.appendChild(actions)
        status?.joinIn(course)

        container.appendChild(course)
      }

      cell.appendChild(container)
      pastCell.replaceWith(cell)
    })
  // #endregion

  // #region row type
  document
    .querySelectorAll('.courselist-c, .courselist-r')
    .forEach(function (pastCourse) {
      const { title, actions, status } = getComponents(pastCourse)

      const year = pastCourse.children[1]
      year.classList.add('year')

      const teachers = pastCourse.children[3]
      teachers.classList.add('teachers')

      const icon = getContent(
        {
          parent: pastCourse,
          selectors: 'img.inline',
        },
        'icon',
        'img',
        'src',
      )

      const remarks = getContent(pastCourse.children[2], 'remarks', 'td')

      const course = document.createElement('tr')
      course.className = 'course row'

      const titleCell = course.insertCell()
      const container = document.createElement('div')
      container.className = 'container'
      icon?.joinIn(container)
      if (title === null) {
        const title = getContent(
          {
            parent: pastCourse,
            selectors: '.courselist-title',
          },
          'title',
        )
        title?.joinIn(container)
      } else {
        container.appendChild(title)
      }

      const statusActions = document.createElement('div')
      statusActions.className = 'status-actions'
      if (status === null) {
        const status = document.createElement('div')
        status.className = 'status dummy'
        statusActions.appendChild(status)
      } else {
        statusActions.appendChild(status)
      }
      statusActions.appendChild(actions)
      container.appendChild(statusActions)
      titleCell.appendChild(container)

      year?.joinIn(course)
      remarks?.joinIn(course)
      teachers?.joinIn(course)

      pastCourse.replaceWith(course)
    })
  // #endregion

  // #region card type
  document.querySelectorAll('.coursecard').forEach(function (pastCourse) {
    const { title, actions, status } = getComponents(pastCourse)
    const { year, remarks } = getYearAndRemarks(pastCourse)

    const icon = getContent(
      {
        parent: pastCourse,
        selectors: '.course-card-img img',
      },
      'icon',
      'img',
      'src',
    )

    const code = getContent(
      {
        parent: pastCourse,
        selectors: '.coursecode',
      },
      'code',
    )

    const linkState = getContent(
      {
        parent: pastCourse,
        selectors: '.courselink-state',
      },
      'link-state',
    )
    if (status !== null) {
      linkState?.joinIn(status)
    }

    const teachers = getContent(
      {
        parent: pastCourse,
        selectors: '.courseitemdetail:last-of-type',
      },
      'teachers',
    )

    const course = document.createElement('div')
    course.className = 'course card'
    icon?.joinIn(course)

    const middle = document.createElement('div')
    middle.className = 'middle'
    code?.joinIn(middle)
    title?.joinIn(middle)
    status?.joinIn(middle)

    const info = document.createElement('div')
    info.className = 'info'
    year?.joinIn(info)
    remarks?.joinIn(info)
    teachers?.joinIn(info)

    middle.appendChild(info)
    course.appendChild(middle)

    course.appendChild(actions)

    pastCourse.replaceWith(course)
  })
  // #endregion
}

/**
 * Replace banners on the right side.
 */
const replaceBanners = function () {
  const bannerList = document.querySelector('.banner-list')
  if (bannerList === null) {
    return
  }

  const anchors = bannerList.querySelectorAll('a')
  bannerList.replaceChildren(...anchors)
}

// Entry point
export default async function () {
  replaceContentBody()
  await replaceFormerLink()
  replaceCourses()
  replaceBanners()
}
