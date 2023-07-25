import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class BusinessProductNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Business
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <rect x={pos.x + 145} y={pos.y + 5} height="15" width="25"  stroke="grey" strokeWidth="1" fill="white" /> 
        <rect x={pos.x + 145} y={pos.y + 5} height="5" width="12.5"  stroke="grey" strokeWidth="1" fill="none" /> 
      </g>
    )
  }
}
