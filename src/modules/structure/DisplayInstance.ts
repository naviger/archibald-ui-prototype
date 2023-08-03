import { NodeStatus } from "../enums/enumNodeStatus"
import { JunctionAnchorData } from "./JunctionAnchorData"
import { NodeAnchorData } from "./NodeAnchorData"
import { Dimensions, Position } from "./Position"

export class DisplayInstance  {
  id: string = "0"
  position: Position = {x:-1, y:-1}
  size:Dimensions = {height:-1, width:-1}
  isVisible: boolean = true
  isSelected: boolean = false
  status: NodeStatus = NodeStatus.Ready
  anchors: Array<NodeAnchorData|JunctionAnchorData> = []
}