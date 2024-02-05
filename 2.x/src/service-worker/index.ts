// Register an action to navigate users to answer the exit survey when they uninstall the extension.
const exitSurveyUrl = process.env.EXIT_SURVEY_URL
if (typeof exitSurveyUrl === 'string') {
  chrome.runtime.setUninstallURL(exitSurveyUrl)
}
