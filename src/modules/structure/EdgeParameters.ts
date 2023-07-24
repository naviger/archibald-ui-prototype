import { EdgePropertyBoxProps } from "../components/EdgePropertyBox"
import { EdgeAnchorParameters } from "./EdgeAnchorParameters"
import { EdgeHandleParameters } from "./EdgeHandleParameters"
import { StateVariable } from "./StateVariable"

export type EdgeParameters = {
  setSelectedEdge:Function
  setHoverEdge:Function
  setLeaveEdge:Function
  dragDone:Function
  anchorParams: EdgeAnchorParameters
  handleParams: EdgeHandleParameters
  index:Number
}