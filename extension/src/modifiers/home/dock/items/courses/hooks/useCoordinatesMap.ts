import { Reducer, useEffect, useReducer } from "react"
import { CoordinatesMap } from "../types/coordinate"
import { dynamicStore } from "../store"

type CoordinatesMapReducerAction = {
  method: 'replace'
  coordinatesMap: CoordinatesMap
} | {
  courseId: string
} & ({
  method: 'add'
  at: number
} |
{
  method: 'clear'
} |
{
  method: 'move'
  from: number
  to: number
})

export type UpdateCoordinatesMap = (action: CoordinatesMapReducerAction) => void
type CoordinatesMapReducer = Reducer<CoordinatesMap, CoordinatesMapReducerAction>

export const useCoordinatesMap = (yearModuleKey: string) => {
  const coordinatesMapReducer: CoordinatesMapReducer = (prevState, action) => {
    if (action.method === 'replace') {
      return action.coordinatesMap
    }

    const coordinates = prevState.get(action.courseId)

    if (action.method === 'add') {
      const nextState = new Map([
        ...prevState,
        [
          action.courseId,
          [
            ...coordinates ?? [],
            action.at
          ]
        ],
      ])
      return nextState
    }

    if (typeof coordinates === 'undefined') {
      return prevState
    }

    if (action.method === 'clear') {
      const nextState = new Map(
        Array.from(prevState).filter(
          ([courseId]) => courseId !== action.courseId
        )
      )
      return nextState
    }

    if (action.method === 'move') {
      const nextState = new Map([
        ...prevState,
        [
          action.courseId,
          [
            ...coordinates.filter(
              coordinate => coordinate !== action.from
            ),
            action.to
          ]
        ],
      ])
      return nextState
    }

    return prevState
  }

  const storeSyncReducer: CoordinatesMapReducer = (prevState, action) => {
    // Apply the change of the coordinates map.
    const nextState = coordinatesMapReducer(prevState, action)
    dynamicStore.coordinatesMap.set(yearModuleKey, nextState)
    return nextState
  }

  const [coordinatesMap, updateCoordinatesMap] = useReducer<CoordinatesMapReducer>(storeSyncReducer, new Map())

  useEffect(() => {
    const coordinatesMap = dynamicStore.coordinatesMap.get(yearModuleKey)
    updateCoordinatesMap({
      method: 'replace',
      coordinatesMap,
    })
  }, [yearModuleKey])

  return {
    coordinatesMap,
    updateCoordinatesMap,
  }
}
