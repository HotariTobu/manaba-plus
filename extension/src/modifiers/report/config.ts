import { SelectorMap } from "@/types/config"

export const selectorMap = {
  // form: 'form:has(.report-form)',
  form: '.form form',
  uploadButton: '.file-upload-button',
  textarea: 'form textarea',
} satisfies SelectorMap

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
