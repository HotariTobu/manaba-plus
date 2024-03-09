import { RootContainer } from "@/components/root-container"
import { NodeItem } from "../../types/nodeItem"
import { CoursesContainer } from "./components/courses-container"

// TODO: Lighten weight

/** The courses node item */
export const coursesItem: NodeItem = {
  id: import.meta.dirname,
  node: <RootContainer><CoursesContainer /></RootContainer>
}
