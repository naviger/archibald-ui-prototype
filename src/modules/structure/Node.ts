import { NodeAnchorData } from "./NodeAnchorData"
import { Position, Dimensions } from "./Position"
import { NodeFamily } from "../enums/enumNodeFamily"
import { NodeType } from "../enums/enumNodeType"
import { NodeStatus } from "../enums/enumNodeStatus"

export type Node = {
  nodeId: string
  name: string
  family: NodeFamily
  dimensions: {height:number, width: number}
  type: NodeType
  data: any
}

export type NodeDisplayInstance = {
  id: string
  nodeData: Node
  position: Position
  oldPosition: Position
  size:Dimensions
  isVisible: boolean
  isSelected: boolean
  annotation: string
  status: NodeStatus
  anchors: Array<NodeAnchorData>
}