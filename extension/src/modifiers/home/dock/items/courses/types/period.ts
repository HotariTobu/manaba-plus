import { StorageItem } from "@/types/storageItem"
import { Coordinate } from "./coordinate"

export interface Period extends Record<string, StorageItem> {
  terms: string[]
  coordinates: Coordinate[]
}
