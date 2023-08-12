import { JunctionType } from "../enums/enumJunctionType"
//import { IAnchorable } from "../interface/anchorable"
import { DisplayInstance } from "./DisplayInstance"
// import { JunctionAnchorData } from "./JunctionAnchorData"
// import { Position } from "./Position"

export class JunctionDisplayInstance  extends DisplayInstance {
  type:JunctionType = JunctionType.And
  showAnchors:boolean = false
} 