import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationDriverNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <circle cx={pos.x + 155} cy={pos.y + 20 } r="8" fill="white" strokeWidth="2" stroke="grey" />
        <circle cx={pos.x + 155} cy={pos.y +20} r="3" fill="grey" strokeWidth="2" stroke="grey" />
        <line x1={pos.x + 155} y1={pos.y + 8} x2={pos.x + 155} y2={pos.y + 32} strokeWidth="2" stroke="grey" />
        <line x1={pos.x + 143} y1={pos.y + 20} x2={pos.x + 166} y2={pos.y + 20} strokeWidth="2" stroke="grey" />
        <line x1={pos.x + 147} y1={pos.y + 28} x2={pos.x + 163} y2={pos.y + 12} strokeWidth="2" stroke="grey" />
        <line x1={pos.x + 147} y1={pos.y + 12} x2={pos.x + 163} y2={pos.y + 28} strokeWidth="2" stroke="grey" />
      </g>
    )
  }
}

