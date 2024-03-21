import { RootContainer } from "@/components/root-container"
import { NodeItem } from "../../types/nodeItem"
import { AssignmentsContainer } from "./components/assignments-container"

// TODO: Lighten weight

/** The assignments node item */
export const AssignmentsItem: NodeItem = {
  id: import.meta.dirname,
  node: <RootContainer><AssignmentsContainer /></RootContainer>
}
