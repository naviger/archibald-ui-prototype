import { EdgeAnchorParameters } from "./EdgeAnchorParameters"
import { EdgeHandleParameters } from "./EdgeHandleParameters"

export type EdgeParameters = {
  setSelectedEdge:Function
  setHover:Function
  clearHover:Function
  dragDone:Function
  anchorParams: EdgeAnchorParameters
  handleParams: EdgeHandleParameters
  index:Number
}