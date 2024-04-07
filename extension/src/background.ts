import browser from "webextension-polyfill";
import { featureUrl, exitSurveyUrl } from '@/../../constants.json'

// Register an action to navigate users to the feature page when they install the extension.
browser.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    browser.tabs.create({
      url: featureUrl
    })
  }
})

// Register an action to navigate users to answer the exit survey when they uninstall the extension.
browser.runtime.setUninstallURL(exitSurveyUrl)
