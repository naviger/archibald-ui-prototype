import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyCollaborationNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <circle cx={pos.x + 160} cy={pos.y + 15} r="10px" stroke="none" fill="white" />
        <circle cx={pos.x + 150} cy={pos.y + 15} r="10px" stroke="none" fill="white" />
        <circle cx={pos.x + 160} cy={pos.y + 15} r="10px" stroke="grey" fill="none" />
        <circle cx={pos.x + 150} cy={pos.y + 15} r="10px" stroke="grey" fill="none" />
      </g>
    )
  }
}

