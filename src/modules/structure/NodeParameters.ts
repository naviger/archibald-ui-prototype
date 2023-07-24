import { CanvasMode } from "../enums/enumCanvasMode"
import { NodeAnchorParameters } from "./NodeAnchorParameters"

export type NodeParameters = {
  canvasMode:CanvasMode
  setHoverNode:Function
  setReady:Function
  inAddAnchor:Function
  clearHoverNode:Function
  setSelectedNode:Function
  startMoveNode:Function
  inMove:Function
  endMoveNode:Function
  addAnchor:Function
  anchorParams:NodeAnchorParameters
  index:number
}