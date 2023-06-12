;(async function () {
  const src = chrome.runtime.getURL('manabaTimeSchedule/js/content.js')
  const contentMain = await import(src)
  contentMain.main()
})()
