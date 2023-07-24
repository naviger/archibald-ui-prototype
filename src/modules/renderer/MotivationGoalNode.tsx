import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationGoalNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 5)
    p1+= "h10 l5 5 v15 h-15 v-20" //+ (pos.x + 145) + " " + (pos.y + 5)
    p1+= "m 10 0 v5 h5"
        
    return (
      <g className="card-icon">
        <circle cx={pos.x + 155} cy={pos.y + 20 } r="11" fill="white" strokeWidth="1" stroke="grey" />
        <circle cx={pos.x + 155} cy={pos.y + 20 } r="7" fill="white" strokeWidth="1" stroke="grey" />
        <circle cx={pos.x + 155} cy={pos.y +20} r="3" fill="grey" strokeWidth="2" stroke="grey" />
      </g>
    )
  }
}

