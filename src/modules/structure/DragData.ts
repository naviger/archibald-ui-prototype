import { EdgeAnchor } from "../renderer/EdgeAnchor";
import { Position } from "./Position";

export type DragData = {
  type:string
  currentId: string
  offset: Position
  position:Position
  data?:Array<EdgeAnchor> | Position
}