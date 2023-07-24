import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class ApplicationInterfaceNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Application
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <circle cx={pos.x + 165} cy={pos.y + 15} r="10px" stroke="grey" fill="white" />
        <line x1={pos.x +140} y1={pos.y + 15} x2={pos.x + 155} y2={pos.y + 15} stroke="grey" strokeWidth="2" />
      </g>
    )
  }
}

