import { createStore } from "@/utils/createStore";
import { Layout } from "../../types/layout";

export const [store] = await createStore(import.meta.dirname, {
  assignmentLayout: new Map() as Layout,
})
