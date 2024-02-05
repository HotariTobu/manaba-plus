import { additionalFormData, selectorMap } from "./config"

const form = document.querySelector<HTMLFormElement>(selectorMap.form)
if (form === null) {
  throw new Error('NullReference: form')
}

/**
 * Upload a file.
 * @param file The file to be submitted
 * @returns True if the submission was succeeded, otherwise false
 */
const submit = async function (file: File) {
  if (form === null) {
    return false
  }

  const formData = new FormData(form)

  // Add form data.
  formData.set(additionalFormData.fileName, file)
  for (const { name, value } of additionalFormData.flags) {
    formData.set(name, value)
  }

  const response = await fetch('', {
    method: 'POST',
    body: formData,
  })

  return response.ok
}

/**
 * Upload files.
 * @param files The file list to be submitted
 */
export const submitAll = async function (files: FileList) {
  const promises: Promise<boolean>[] = []

  for (const file of files) {
    promises.push(submit(file))
  }

  await Promise.all(promises)

  location.reload()
}
