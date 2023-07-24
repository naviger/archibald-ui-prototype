import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationRequirementNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 5)
    p1+= " h25 l-5 15 h-25 l5 -15"
   // p1+= " m 0 15 l5 0 h-15"
        
    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p1} />
      </g>
    )
  }
}

