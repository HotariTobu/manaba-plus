import browser from "webextension-polyfill";

// Register an action to navigate users to answer the exit survey when they uninstall the extension.
const exitSurveyUrl = import.meta.env.VITE_EXIT_SURVEY_URL
if (typeof exitSurveyUrl === 'string') {
  browser.runtime.setUninstallURL(exitSurveyUrl)
}


debug: {
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
      browser.scripting.executeScript({
        target: {
          tabId,
        },
        files: [
          'https://cdn.tailwindcss.com',
        ],
      })
    }
  });
}
