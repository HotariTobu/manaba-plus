import { popMessages } from '../utils/messages'
import Assignment from './assignment'
import '../extension/htmlElement'
import getOptions from '../options/model'
import * as assignments from './assignments'
import * as time from '../utils/time'
import * as event from './event'
import * as storage from '../utils/storage'
import constants from '../constants'

// #region DEBUG Dummy
import dummies from './dummies.json'
// #endregion

/**
 * Insert messages on the main panel.
 */
const insertMessages = async function () {
  const { options } = await getOptions()

  if (!options['main-panel'].messages['show-messages'].value) {
    return
  }

  const messageHolder = document.querySelector('#messages-holder')
  if (messageHolder === null) {
    return
  }

  const messages = await popMessages()
  for (const message of messages) {
    const messageDiv = document.createElement('div')
    messageDiv.textContent = message
    messageHolder.appendChild(messageDiv)
  }
}

/**
 * Insert a remove button.
 * @param actions The container element
 */
export const insertRemove = function (actions: Element) {
  if (actions === null) {
    return
  }

  const remove = document.createElement('div')
  remove.className = 'remove'
  actions.appendChild(remove)
}

// #region Assignment list
/**
 * Get DEFCON from an assignment's deadline.
 * DEFCON is the condition that indicates the urgency of the assignment.
 * @param dateTime The deadline of the assignment
 * @returns The DEFCON value
 */
const getDEFCON = function (dateTime: Date) {
  if (dateTime === null) {
    return 'defcon-1'
  }

  const delta = dateTime.getTime() - Date.now()
  if (delta < 0) {
    return 'defcon-0'
  }

  const dayCount = delta / (24 * 60 * 60 * 1000)
  switch (true) {
    case dayCount < 1:
      return 'defcon-4'
    case dayCount < 3:
      return 'defcon-3'
    case dayCount < 7:
      return 'defcon-2'
    default:
      return 'defcon-1'
  }
}

let assignmentListHolder: Element

/**
 * Create an element from an assignment object and append it to the holder.
 * @param assignment The assignment object
 */
const appendAssignment = function (assignment: Assignment) {
  const deadline = assignment.deadline

  const row = document.createElement('tr')
  row.className = 'assignment'
  row.classList.add(getDEFCON(deadline))
  Object.defineProperty(row, 'assignment', { value: assignment })
  row.shown(assignment.isShown)

  const courseUrl = /.+course_\d+/.exec(assignment.url)[0]

  const courseDiv = document.createElement('div')
  courseDiv.className = 'course-name'
  const courseAnchor = document.createElement('a')
  courseAnchor.href = courseUrl
  courseAnchor.textContent = assignment.course
  courseDiv.appendChild(courseAnchor)
  row.insertCell().appendChild(courseDiv)

  const title = document.createElement('div')
  title.className = 'title'

  const titleAnchor = document.createElement('a')
  titleAnchor.href = assignment.url
  titleAnchor.textContent = assignment.title
  title.appendChild(titleAnchor)

  const actions = document.createElement('div')
  actions.className = 'actions'
  title.appendChild(actions)
  insertRemove(actions)

  row.insertCell().appendChild(title)

  const deadlineText = document.createTextNode(
    deadline?.toLocaleString('ja-JP', {
      month: 'short',
      day: '2-digit',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    }) ?? ''
  )
  row.insertCell().appendChild(deadlineText)

  const remainingTimeSpan = document.createElement('span')
  remainingTimeSpan.className = 'remaining-time'
  row.insertCell().appendChild(remainingTimeSpan)

  if (deadline !== null) {
    setRemainingTime(deadline, remainingTimeSpan)
    setInterval(setRemainingTime, 1000, deadline, remainingTimeSpan)
  }

  assignmentListHolder?.appendChild(row)
}

const appendError = function (message: string) {
  const row = document.createElement('tr')
  row.className = 'error'

  const cell = row.insertCell()
  cell.textContent = message

  assignmentListHolder?.appendChild(row)
}

/**
 * Set remaining time of an assignment.
 * @param deadline The deadline of the assignment
 * @param element The remaining time element
 */
const setRemainingTime = function (deadline: Date, element: Element) {
  const delta = deadline.getTime() - Date.now()
  const dayCount = time.dayCount(delta)

  if (dayCount > 2) {
    element.classList.add('day-count')
    element.textContent = Math.floor(dayCount).toString()
  } else if (dayCount > 0) {
    element.classList.add('time')
    element.textContent = time.toString(delta, false)
  }
}

let isAssignmentListInserted = false

export const insertAssignmentList = async function () {
  if (isAssignmentListInserted) {
    return
  }

  isAssignmentListInserted = true

  assignmentListHolder = document.querySelector<HTMLElement>(
    '#assignment-list-holder'
  )

  const { options } = await getOptions()

  const assignmentsData: string[] = []

  try {
    for await (const assignment of assignments.list()) {
      appendAssignment(assignment)
      assignmentsData.push(assignment.toString())
    }
  } catch (error) {
    appendError(error)
    return
  }

  // #region DEBUG Dummy
  // Insert dummy assignments.
  for (const dummy of dummies) {
    const assignment = new Assignment(
      dummy.url,
      dummy.title,
      dummy.course,
      new Date(dummy.deadline)
    )

    appendAssignment(assignment)
    assignmentsData.push(assignment.toString())
  }
  // #endregion

  // Store data to be used by reminders.
  storage.set(constants['storage-keys']['assignments-data'], assignmentsData)

  // Sort the assignment list.
  document
    .querySelector('#assignment-list-deadline-header')
    ?.dispatchEvent(new Event('click'))

  // #region Add actions
  const removedCollectionItem = options['main-panel'][
    'removed-assignments'
  ] as OptionCollectionItem

  event.addVisibilityAction({
    removedCollectionItem,
    inputSelectors: '#assignments-visibility-input',
    revertSelectors: '.assignment[removed]',
    removeSelectors: '.assignment',
  })

  event.addRemovesAction(removedCollectionItem, '.assignment')
  // #endregion
}
// #endregion

/**
 * Insert some components into the main panel.
 */
export const insertMainComponents = async function () {
  // Make assignment-list sortable.
  require('sortable-decoration')

  const { options } = await getOptions()

  await insertMessages()

  const assignmentListContainer = document.querySelector<HTMLDetailsElement>(
    '#assignment-list-container'
  )
  if (assignmentListContainer !== null) {
    assignmentListContainer.open =
      options['main-panel']['show-assignment-list-open'].value
    if (assignmentListContainer.open) {
      await insertAssignmentList()
    }
  }
}
