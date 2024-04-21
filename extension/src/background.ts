import browser from "webextension-polyfill";
import { homePageUrl, exitSurveyUrl } from '@/../../constants.json'
import { t } from "@/utils/i18n";
import { pushNotification } from "@/notification";

/**
 * Extract major and minor version numbers from a version string.
 * @param version: The version string
 * @returns An extracted string
 */
const getVersionString = (version?: string) => {
  if (typeof version === 'undefined') {
    const manifest = browser.runtime.getManifest()
    version = manifest.version
  }

  const match = /(\d+?.\d+?).\d+?/.exec(version)
  if (match === null) {
    return null
  }
  return match[1]
}

// Register an action to navigate users to the feature page when they install the extension.
browser.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    browser.tabs.create({
      url: homePageUrl + t('feature_page_path')
    })
  }
  else if (details.reason === 'update') {
    const previousVersion = getVersionString(details.previousVersion)
    const currentVersion = getVersionString()
    if (previousVersion !== currentVersion) {
      pushNotification(t('notification_version', currentVersion ?? ''))
    }
  }
})

// Register an action to navigate users to answer the exit survey when they uninstall the extension.
browser.runtime.setUninstallURL(exitSurveyUrl)
