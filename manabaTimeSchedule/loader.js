(async ()=>{
    const src = chrome.runtime.getURL("js/content.js");
    const contentMain = await import(src);
    contentMain.main()
})();