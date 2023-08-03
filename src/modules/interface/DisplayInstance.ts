import { NodeStatus } from "../enums/enumNodeStatus"
import { Dimensions, Position } from "../structure/Position"
import { IAnchorable } from "./anchorable"

export interface DisplayInstance {
  id: string
  position: Position
  size:Dimensions
  isVisible: boolean
  isSelected: boolean
  status: NodeStatus
  anchors: Array<IAnchorable>
}