import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationValueNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    
    return (
      <g className="card-icon">
        <ellipse cx={pos.x +155} cy={pos.y + 15} rx="18" ry="10" fill="white" stroke="grey" /> 
      </g>
    )
  }
}

