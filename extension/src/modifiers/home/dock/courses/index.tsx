import { RootContainer } from "@/components/root-container"
import { NodeItem } from "../types/nodeItem"
import { CoursesContainer } from "./components/courses-container"

export const coursesItem: NodeItem = {
  id: import.meta.dirname,
  node: <RootContainer><CoursesContainer /></RootContainer>
}
