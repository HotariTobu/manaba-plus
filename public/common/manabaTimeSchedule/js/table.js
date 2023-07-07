export function createTable(setting, courseCardDict) {
  // 時間割用の表だけを作成
  const table = document.createElement('table')
  table.border = '1'
  table.width = document.getElementsByClassName('mycourses-body').width
  console.log(document.getElementsByClassName('mycourses-body'))
  // 設定に応じた変数定義
  let rows
  let wid
  if (setting.saturday) {
    rows = ['', '月', '火', '水', '木', '金', '土']
    wid = '100px'
  } else {
    rows = ['', '月', '火', '水', '木', '金']
    wid = '120px'
  }

  const column = Number(setting.column)

  const additionalColumn = Number(setting.additionalColumn)
  const additionalTitle = setting.additionalTitle

  // courseCardの情報を抽出し使いやすく整形
  const cellCardInfo = {}
  for (const key in setting) {
    const value = setting[key]
    if (/courseCardFrame.*?@id-.*?\/.*?/.test(value)) {
      cellCardInfo[value] = courseCardDict[key] // keyとvalueの入れ替えがあるので注意
    }
  }

  // 時間割の大本を作成
  let additional
  // let additionalUsed = 0
  for (let i = 0; i < 1 + column + additionalColumn; i++) {
    const tr = document.createElement('tr')
    if (i === 0) {
      for (const l of rows) {
        const th = document.createElement('th')
        th.textContent = l
        tr.appendChild(th)
      }
    } else {
      additional = i < 1 + column
      for (let l = 0; l < rows.length; l++) {
        if (l === 0) {
          // 時限のセル
          const th = document.createElement('th')
          if (additional) {
            // 通常行
            th.textContent = i
          } else {
            // 追加の行
            th.textContent = additionalTitle
          }
          tr.appendChild(th)
        } else {
          // 講義のセル
          const td = document.createElement('td')
          td.classList.add('courseCardFrame')
          if (additional) {
            td.id = `courseCardFrame@id-${i}/${l}`
          } else {
            td.id = `courseCardFrameAdditional@id-${i - 1 - column}/${l}`
          }
          try {
            td.appendChild(cellCardInfo[td.id])
            delete cellCardInfo[td.id]
            // additionalUsed += 1
          } catch (e) {}
          td.width = wid
          td.height = '110px'
          tr.appendChild(td)
        }
      }
    }
    table.appendChild(tr)
  }
  // 表示されてないものがあれば行を追加して表示する
  const leftCards = Object.keys(cellCardInfo).length
  if (leftCards) {
    const addColumn = Math.floor(leftCards / (rows.length - 1) + 1)
    for (let i = 0; i < addColumn; i++) {
      // 一行分
      const tr = document.createElement('tr')
      // タイトル
      const th = document.createElement('th')
      th.textContent = '非表示'
      tr.appendChild(th)
      // courseCard
      for (let l = 0; l < rows.length - 1; l++) {
        const td = document.createElement('td')
        td.classList.add('courseCardFrame')
        td.id = `courseCardFrameHided@id-${i}/${l}`
        try {
          td.appendChild(Object.values(cellCardInfo)[i * (rows.length - 1) + l])
        } catch (e) {}
        td.width = wid
        td.height = '110px'
        tr.appendChild(td)
      }
      table.appendChild(tr)
    }
  }

  return table
}
