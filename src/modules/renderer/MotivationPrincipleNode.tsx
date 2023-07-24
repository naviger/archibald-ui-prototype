import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationPrincipleNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 7)
    p1+= "a30,30 0 0,1 20, 0 "
    p1+= "a30,30 0 0,1 0, 15 "
    p1+= "a30,30 0 0,1 -20, 0 "
    p1+= "a30,30 0 0,1 0, -15 "
        
    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p1} />
        <text x={pos.x + 152.5} y={pos.y+ 20} fontWeight="bold">!</text>
      </g>
    )
  }
}

