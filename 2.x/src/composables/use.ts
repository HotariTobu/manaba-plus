import { computed, ref } from "vue"

/**
 * Get async data.
 * @param getter The function to get the data
 * @returns pending A ref object that is true until getting data is over
 * @returns data A ref object of gotten data
 * @returns error A ref object that is null until getting data is over, and is an error object if some error occurs
 */
const use = <T>(getter: () => Promise<T>) => {
  let value: T | null = null

  const error = ref<Error | null>(null)
  const pending = ref(true)
  const data = computed(() => pending.value ? null : value)

  getter()
    .then(v => value = v)
    .catch(e => error.value = e)
    .finally(() => pending.value = false)

  return {
    pending,
    data,
    error,
  }
}

export default use
