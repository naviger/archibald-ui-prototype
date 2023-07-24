import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class MotivationAssessmentNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Motivation
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <circle cx={pos.x + 165} cy={pos.y + 15} r="7px" stroke="grey" fill="white" />
        <line x1={pos.x +151} y1={pos.y + 25} x2={pos.x + 159} y2={pos.y + 19} stroke="grey" strokeWidth="2" />
      </g>
    )
  }
}

