export type StorageItem = {
  [key: string]: StorageItem
} | StorageItem[] | number | string | boolean | null | undefined
