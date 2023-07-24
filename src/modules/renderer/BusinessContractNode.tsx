import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class BusinessContractNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Business
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <line x1={pos.x} y1={pos.y + 85} x2={pos.x + 180} y2={pos.y + 85} stroke="grey" strokeWidth="1" />
      </g>
    )
  }
}

