import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class ApplicationComponentNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Application
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <rect x={pos.x + 143} y={pos.y + 8} height="20" width="25" stroke="grey" fill="white" />
        <rect x={pos.x + 140} y={pos.y + 12} height="4" width="6" stroke="grey" fill="white"  />
        <rect x={pos.x + 140} y={pos.y + 20} height="4" width="6" stroke="grey" fill="white"  />
      </g>
    )
  }
}

