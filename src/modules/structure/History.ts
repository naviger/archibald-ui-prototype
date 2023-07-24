import { Entity } from "./Entity"

export type History = {
  modifiedDate: Date
  modifiedBy: Entity
  description: string
}