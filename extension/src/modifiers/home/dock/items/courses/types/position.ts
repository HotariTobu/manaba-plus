enum Positions {
  main,
  other,
  rest,
  trash,
}

export type Position = keyof typeof Positions

export const positions = Object.keys(Positions).filter(p => isNaN(parseInt(p)))
