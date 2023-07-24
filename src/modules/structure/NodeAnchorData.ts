import { Position } from "./Position";

export type NodeAnchorData = {
  id: string
  position: Position
  status: number,
  edges:Array<string>
}