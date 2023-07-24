import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationMeaningNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +144) + " " + (pos.y + 7)
    p1 += "a4, 4 0 0,1 5, 0"
    p1 += "a9, 9 0 0,1 8, 0"
    p1 += "a5, 4 0 0,1 5, 5"
    p1 += "a6, 9 0 0,1 -2, 3"
    p1 += "a6, 4 0 0,1 -7, 5"
    p1 += "a9, 8 0 0,1 -12, -2"
    p1 += "a2, 2 0 0,1 -2, -6"
    p1 += "a3, 2 0 0,1 6, -5"
        
    return (
      <g className="card-icon">
        <ellipse cx={pos.x +135} cy={pos.y + 30} rx="2" ry="1.5" fill="white" stroke="grey" /> 
        <ellipse cx={pos.x +139} cy={pos.y + 25} rx="4" ry="3" fill="white" stroke="grey" /> 
        <path fill="white" stroke="grey" d={p1} />
      </g>
    )
  }
}

