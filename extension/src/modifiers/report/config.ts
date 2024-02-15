import { defineClassMap, defineSelectorMap } from "@/types/config"

export const selectorMap = defineSelectorMap({
  // form: 'form:has(.report-form)',
  form: '.form form',
  addFileButton: '.file-upload-button',
  textarea: 'form textarea',
})

/**
 * Form data added before data submitted
 */
export const additionalFormData = {
  fileName: 'RptSubmitFile',
  flags: [
    {
      name: 'action_ReportStudent_submitdone',
      value: '1',
    },
  ],
}