import { Phase } from "./types/phase"

/**
 * Determine an assignment phase from the deadline.
 * @param deadline The deadline of the assignment
 * @returns The assignment phase
 */
export const getAssignmentPhase = (deadline: Date | null): Phase => {
  if (deadline === null) {
    return 'long'
  }

  const delta = deadline.getTime() - Date.now()
  if (delta < 0) {
    return 'over'
  }

  const dayCount = delta / (24 * 60 * 60 * 1000)
  switch (true) {
    case dayCount < 1:
      return 'moment'
    case dayCount < 3:
      return 'around'
    case dayCount < 7:
      return 'about'
    default:
      return 'long'
  }
}
