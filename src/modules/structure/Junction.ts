import { JunctionType } from "../enums/enumJunctionType"
import { DisplayInstance } from "./DisplayInstance"

export class JunctionDisplayInstance  extends DisplayInstance {
  type:JunctionType = JunctionType.And
  showAnchors:boolean = false
} 