import { castContentContext } from './content.type'
import errors from './errors.json'

const errorMap = new Map(Object.entries(errors))

// #region Progress
const progressBarHolder = document.querySelector('#progress-bars-holder')
if (progressBarHolder === null) {
  throw new Error('NullReference: progressBar holder')
}

const createProgress = function (trace: ScrapingTrace, child: Element | null) {
  const container = document.createElement('div')
  container.className = 'progress-container'

  const itemNameDiv = document.createElement('div')
  itemNameDiv.className = 'item-name'
  itemNameDiv.textContent = trace.token
  container.appendChild(itemNameDiv)

  const progress = document.createElement('progress')
  progress.max = trace.max
  progress.value = trace.index
  container.appendChild(progress)

  if (child !== null) {
    const subHolder = document.createElement('div')
    subHolder.className = 'sub-holder'
    subHolder.appendChild(child)

    container.appendChild(subHolder)
  }

  return container
}

export const updateProgress = function (traces: ScrapingTrace[]) {
  if (traces === null || traces.length === 0) {
    return
  }

  let lastProgress: Element | null = null
  for (const trace of traces) {
    lastProgress = createProgress(trace, lastProgress)
  }

  if (lastProgress === null) {
    return
  }

  progressBarHolder.replaceChildren(lastProgress)
}

export const clearProgress = function () {
  progressBarHolder.replaceChildren()
}
// #endregion

// #region Contents
const contentsHolder = document.querySelector('#contents-holder')
if (contentsHolder === null) {
  throw new Error('NullReference: contents holder')
}

const createContentBody = function (context: ContentContext) {
  const body = document.createElement('div')
  body.className = 'body'
  if (context.excluded) {
    body.classList.add('excluded')
  } else {
    body.classList.add('pending')
  }

  const titleDiv = document.createElement('div')
  titleDiv.className = 'title'
  titleDiv.textContent = context.tokens[0]
  body.appendChild(titleDiv)

  const parentAnchor = document.createElement('a')
  parentAnchor.className = 'parent'
  parentAnchor.href = context.parentUrl
  parentAnchor.target = '_blank'
  body.appendChild(parentAnchor)

  const statusDiv = document.createElement('div')
  statusDiv.id = context.hash
  statusDiv.className = 'status'
  body.appendChild(statusDiv)

  return body
}

const createContentNode = function (token: string, child?: Element) {
  const node = document.createElement('details')
  node.setAttribute('open', '')
  node.setAttribute('token', token)

  const summary = document.createElement('summary')
  summary.textContent = token
  node.appendChild(summary)

  if (typeof child !== 'undefined') {
    node.appendChild(child)
  }

  return node
}

/**
 * Append an item to the view.
 * Create nodes if they do not exist, or insert the item into them.
 * @param context The item shown in the view
 */
export const appendContent = function (context: ContentContext) {
  const tokens = [...context.tokens]

  // Get the deepest node of existing ones.
  let existingNode = contentsHolder
  while (true) {
    const token = tokens.pop()
    if (typeof token === 'undefined') {
      break
    }

    const node = existingNode.querySelector(`:scope > [token="${token}"]`)

    if (node === null) {
      tokens.push(token)
      break
    } else {
      existingNode = node
    }
  }

  // Make up nodes.
  let lastNode: Element = createContentBody(context)
  for (const token of tokens.slice(1)) {
    lastNode = createContentNode(token, lastNode)
  }

  existingNode.appendChild(lastNode)
}

export const updateContents = function (stacks: {
  downloading: DownloadContext[]
  interrupted: [DownloadContext, string][]
  completed: DownloadContext[]
}) {
  // Use getElementById because the hash can start with a number and it cannot adapt to the CSS3 selector.
  const getBoundElements = function (downloadContext: DownloadContext) {
    const context = castContentContext(downloadContext)

    const statusDiv = document.getElementById(context.hash)
    if (statusDiv === null) {
      return null
    }

    const body = statusDiv.closest('.body')
    if (body === null) {
      return null
    }

    return { statusDiv, body }
  }

  stacks.downloading.forEach(function (context) {
    const boundElements = getBoundElements(context)
    if (boundElements === null) {
      return
    }

    boundElements.body.classList.remove('pending')
    boundElements.body.classList.add('downloading')
  })

  stacks.interrupted.forEach(function ([context, error]) {
    const boundElements = getBoundElements(context)
    if (boundElements === null) {
      return
    }

    const message = errorMap.get(error) ?? error
    boundElements.statusDiv.textContent = message

    boundElements.body.classList.remove('pending', 'downloading')
    boundElements.body.classList.add('interrupted')
  })

  stacks.completed.forEach(function (context) {
    const boundElements = getBoundElements(context)
    if (boundElements === null) {
      return
    }

    boundElements.body.classList.remove('pending', 'downloading')
    boundElements.body.classList.add('completed')
  })
}

export const clearContents = function () {
  contentsHolder.replaceChildren()
}
// #endregion

// #region
export const appendError = function (url: string, message: string) {
  const errorDiv = document.createElement('div')
  errorDiv.className = 'error'

  const urlDiv = document.createElement('div')
  urlDiv.className = 'url'
  urlDiv.textContent = url
  errorDiv.appendChild(urlDiv)

  const messageDiv = document.createElement('div')
  messageDiv.className = 'message'
  messageDiv.textContent = message
  errorDiv.appendChild(messageDiv)

  contentsHolder.insertAdjacentElement('afterbegin', errorDiv)
}
// #endregion
