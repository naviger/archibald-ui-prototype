import { AnchorStatus } from "../enums/enumAnchorStatus"
import { Position } from "./Position"

export type Anchorable = {
  id: string
  position: Position
  status: AnchorStatus,
  edges:Array<string>
}