import { UniqueIdentifier } from "@dnd-kit/core";

export interface Item {
  id: UniqueIdentifier
}

export type ItemsMap<I extends Item> = Map<UniqueIdentifier, I[]>
