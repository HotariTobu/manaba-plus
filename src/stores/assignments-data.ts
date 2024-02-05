import * as storage from '@/utils/storage'

const key = 'assignment-data'

export const setAssignmentsData = async (data: string[]) =>
  await storage.set(key, data)

export const getAssignmentsData = async () =>
  await storage.get<string[]>(key, [])
