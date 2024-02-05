import { defineClassMap, defineIdMap, defineSelectorMap } from "@/types/config"

export const idMap = defineIdMap({
  addFileButton: '',
})

export const selectorMap = defineSelectorMap({
  // form: 'form:has(.report-form)',
  form: '.form form',
  addFileButton: '.file-upload-button',
  textarea: 'form textarea',
})

export const classMap = defineClassMap({
  formDnD: 'bg-secondary',
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
