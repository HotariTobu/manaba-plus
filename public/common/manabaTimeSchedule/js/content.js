import {
  registerDragEventDict,
  registerOverEventArray,
  registerOverEventDict,
} from './courseCardDrag.js'
import { createCourseCard } from './createCourseCard.js'
import { createTable } from './table.js'

export function main() {
  const body = document.getElementsByClassName('mycourses-body')[0]
  // 時間割が表示できない部分だった場合終了
  if (!body) {
    return
  }

  // courseCardを新しく生成
  const courseCards = document.querySelectorAll('.course.card')

  const newCourseCardDict = {}
  for (let i = 0; i < courseCards.length; i++) {
    const newCard = createCourseCard(courseCards[i])
    newCourseCardDict[newCard.id] = newCard
  }
  if (Object.keys(newCourseCardDict).length === 0) {
    return
  } // 情報が取得できなかったら終了

  const msg = document.createElement('p')
  msg.textContent = '拡張機能の設定から表示を変更できます'
  body.appendChild(msg)

  // ドラッグによる移動の実装、item
  registerDragEventDict(newCourseCardDict)
  registerOverEventDict(newCourseCardDict)

  // courseCardの余りを削除
  Array.from(courseCards).map((x) => x.remove())

  // 情報を読み込みこむ
  const setting = chrome.storage.sync.get()
  setting.then(onGot, onError)

  function onGot(setting) {
    if (typeof setting.saturday !== 'undefined') {
      // 時間割の作成
      console.log('load setting')
      body.appendChild(createTable(setting, newCourseCardDict))
      // 時間割にコースカードを追加
      // addCourseCard(setting,newCourseCardDict)
    } else {
      // 初回実行時のみこちら
      console.log('init')
      const info = {
        saturday: false,
        column: 5,
        additionalColumn: 1,
        additionalTitle: '他',
      }
      let i = 0
      for (const key in newCourseCardDict) {
        const col = Math.floor(i / 5)
        info[key] = `courseCardFrame@id-${col + 1}/${(i % 5) + 1}`
        i++
      }
      body.appendChild(createTable(info, newCourseCardDict))
      // 次回以降用に保存
      chrome.storage.sync.set(info)
    }
    // ドロップ先の実装、boxes
    const boxes = document.getElementsByClassName('courseCardFrame')
    registerOverEventArray(boxes)
  }

  function onError(error) {
    console.log(`Error: ${error}`)
  }
}
