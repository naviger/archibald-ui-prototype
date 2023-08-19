import { HistoryActionType } from "../enums/enumHistoryType"
import { Entity } from "./Entity"

export type History = {
  correlation: string
  modifiedDate: Date
  type: HistoryActionType
  objectType: string
  modifiedBy: Entity
  description: string
  data: Object
}