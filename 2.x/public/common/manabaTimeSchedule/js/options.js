window.onload = function () {
  // uiを読み込む
  const saturday = document.getElementById('saturday')
  const column = document.getElementById('column')
  const additionalColumn = document.getElementById('additionalColumn')
  const additionalTitle = document.getElementById('additionalTitle')
  const registerButton = document.getElementById('registerButton')

  // init
  const currentSetting = chrome.storage.sync.get([
    'saturday',
    'column',
    'additionalColumn',
    'additionalTitle',
  ])
  currentSetting.then(onGot, onError)

  function onGot(info) {
    saturday.checked = info.saturday
    column.selectedIndex = info.column - 1 // 〇が無いのでその分インデックスに変換
    additionalColumn.selectedIndex = info.additionalColumn
    additionalTitle.value = info.additionalTitle
  }
  function onError(error) {
    console.log(`Error: ${error}`)
  }

  // 登録ボタンに登録処理を紐づける
  registerButton.addEventListener('click', function () {
    chrome.storage.sync.set({
      saturday: saturday.checked,
      column: column.value,
      additionalColumn: additionalColumn.value,
      additionalTitle: additionalTitle.value,
    })
  })
}
