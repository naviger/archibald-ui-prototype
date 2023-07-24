import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationStakeholderNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +170) + " " + (pos.y + 25)
    p1+= "h-25 a15 15 0 0, 1 0, -20 h25 a20 20 0 0,1 0, 20 m 0 -20"
    
    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p1} />
        <ellipse cx={pos.x +170} cy={pos.y + 15} rx="5" ry="10" fill="white" stroke="grey" /> 
      </g>
    )
  }
}

