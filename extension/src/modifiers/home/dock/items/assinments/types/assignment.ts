import { z } from 'zod'

const assignmentSchema = z.object({
  id: z.string(),

  url: z.string().url(),
  title: z.string(),
  deadline: z.coerce.date().nullable(),

  type: z.object({
    url: z.string().url(),
    label: z.string(),
  }).nullable(),

  course: z.object({
    url: z.string().url(),
    title: z.string(),
  }).nullable(),
})

export type Assignment = z.infer<typeof assignmentSchema>

export const assignmentToString = (assignment: Assignment) => {
  return JSON.stringify(assignment)
}

export const assignmentFromString = (value: string) => {
  const obj = JSON.parse(value)
  const result = assignmentSchema.safeParse(obj)
  if (result.success) {
    return result.data
  }
  else {
    return null
  }
}
