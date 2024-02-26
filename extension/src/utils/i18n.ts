import browser from "webextension-polyfill";

/** Get a translated string selected by an id */
export const t = browser.i18n.getMessage
