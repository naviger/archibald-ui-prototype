import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationOutcomeNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +155) + " " + (pos.y + 13)
    p1+= "v7 h7 z"
    
    let p2:string = "M" + (pos.x +158) + " " + (pos.y + 16)
    p2+= " l10 -10" 
    p2+= " m -5 5 l1 -7 m-1 7 l7 -1"
        
    return (
      <g className="card-icon">
        <circle cx={pos.x + 155} cy={pos.y + 20 } r="11" fill="white" strokeWidth="1" stroke="grey" />
        <circle cx={pos.x + 155} cy={pos.y + 20 } r="7" fill="white" strokeWidth="1" stroke="grey" />
        <circle cx={pos.x + 155} cy={pos.y +20} r="3" fill="grey" strokeWidth="2" stroke="grey" />
        <path fill="black" stroke="grey" strokeWidth="0" d={p1} />
        <path fill="none" stroke="black" strokeWidth="2" d={p2} />
      </g>
    )
  }
}

