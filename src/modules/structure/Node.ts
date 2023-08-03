import { NodeAnchorData } from "./NodeAnchorData"
import { Position, Dimensions } from "./Position"
import { NodeFamily } from "../enums/enumNodeFamily"
import { NodeType } from "../enums/enumNodeType"
import { DisplayInstance } from "./DisplayInstance"

export type Node = {
  nodeId: string
  name: string
  family: NodeFamily
  dimensions: {height:number, width: number}
  type: NodeType
  data: any
}

export class NodeDisplayInstance extends DisplayInstance {
  nodeData: Node = { nodeId:"-1", name:"null", family:NodeFamily.ActiveStructureElement, dimensions:{height:-1, width:-1}, type:NodeType.ApplicationCollaboration, data:{}}
  annotation: string = ""
} 