/**
 * Add press events to a node and detect a long press.
 * @param node The target node
 * @param func A callback function called when a long press detected
 * @param useCapture Whether use capture phase events
 */
const detectLongPress = (node: Node, func: () => void, useCapture = true) => {
  let pressTimer: NodeJS.Timeout

  const startLongPress = () => {
    pressTimer = setTimeout(func, 1000)
  }

  const cancelLongPress = () => {
    clearTimeout(pressTimer)
    console.log('cancel')
  }

  node.addEventListener('touchstart', startLongPress, useCapture)
  document.addEventListener('touchend', cancelLongPress, useCapture)

  node.addEventListener('mousedown', startLongPress, useCapture)
  document.addEventListener('mouseup', cancelLongPress, useCapture)
  // node.addEventListener('mouseout', cancelLongPress, useCapture)
  // node.addEventListener('mouseleave', cancelLongPress, useCapture)
}

export default detectLongPress
