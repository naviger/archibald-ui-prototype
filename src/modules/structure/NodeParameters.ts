import { CanvasMode } from "../enums/enumCanvasMode"
import { NodeAnchorParameters } from "./NodeAnchorParameters"

export type NodeParameters = {
  setHover:Function
  setReady:Function
  inAddAnchor:Function
  clearHover:Function
  setSelected:Function
  startMove:Function
  move:Function
  inMove:Function
  endMove:Function
  addAnchor:Function
  anchorParams:NodeAnchorParameters
  index:number
}