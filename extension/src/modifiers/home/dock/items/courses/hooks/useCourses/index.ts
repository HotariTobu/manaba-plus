import { useState } from "react"
import { ItemsMap } from "@/components/sortable/item"
import { Course } from "../../types/course"
import { getCoursesMap, refreshCoursesMap, storeCoursesMap } from "./coursesMap"

let initialCoursesMap: ItemsMap<Course> | null = null

export const useCourses = () => {
  if (initialCoursesMap === null) {
    initialCoursesMap = getCoursesMap()
  }

  const [coursesMap, setRawCoursesMap] = useState(initialCoursesMap)

  const setCoursesMap = (coursesMap: ItemsMap<Course>) => {
    refreshCoursesMap(coursesMap)
    setRawCoursesMap(coursesMap)
  }

  return {
    coursesMap,
    setCoursesMap,
    storeCoursesMap,
  }
}
