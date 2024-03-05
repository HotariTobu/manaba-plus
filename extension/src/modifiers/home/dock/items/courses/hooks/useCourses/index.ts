import { useState } from "react"
import { ItemsMap } from "@/components/sortable/item"
import { Course } from "../../types/course"
import { getCoursesMap, storeCoursesMap } from "./coursesMap"

let initialCoursesMap: ItemsMap<Course> | null = null

export const useCourses = () => {
  if (initialCoursesMap === null) {
    initialCoursesMap = getCoursesMap()
  }

  const [coursesMap, setCoursesMap] = useState(initialCoursesMap)

  return {
    coursesMap,
    setCoursesMap,
    storeCoursesMap,
  }
}
