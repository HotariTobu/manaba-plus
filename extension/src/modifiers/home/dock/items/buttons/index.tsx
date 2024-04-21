import { RootContainer } from "@/components/root-container"
import { NodeItem } from "../../types/nodeItem"
import { ButtonsContainer } from "./components/buttons-container"

/** The buttons node item */
export const ButtonsItem: NodeItem = {
  id: import.meta.dirname,
  node: <RootContainer><ButtonsContainer /></RootContainer>
}
