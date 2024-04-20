import { UniqueIdentifier } from "@dnd-kit/core";

export type Item = {
  id: UniqueIdentifier
}

export type ItemsMap<I extends Item> = Map<UniqueIdentifier, I[]>
