import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologySystemSoftwareNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <circle cx={pos.x + 167} cy={pos.y + 13} r="10px" stroke="grey" fill="white" />
        <circle cx={pos.x + 165} cy={pos.y + 15} r="10px" stroke="grey" fill="white" />
      </g>
    )
  }
}
