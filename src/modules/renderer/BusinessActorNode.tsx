import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class BusinessActorNode extends BaseNode {

  layer:ArchimateLayer = ArchimateLayer.Business

  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <circle cx={pos.x + 165} cy={pos.y + 8} r="4px" stroke="grey" fill="white" />
        <line x1={pos.x + 160} y1={pos.y + 15} x2={pos.x + 170} y2={pos.y + 15} stroke="grey" strokeWidth="2" />
        <line x1={pos.x + 165} y1={pos.y + 12} x2={pos.x + 165} y2={pos.y + 20} stroke="grey" strokeWidth="2" />
        <line x1={pos.x + 165} y1={pos.y + 20} x2={pos.x + 160} y2={pos.y + 25} stroke="grey" strokeWidth="2" />
        <line x1={pos.x + 165} y1={pos.y + 20} x2={pos.x + 170} y2={pos.y + 25} stroke="grey" strokeWidth="2" />
      </g>
    )
  }
}

