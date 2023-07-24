import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class StrategyCapabilityNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Strategy
  
  renderIcon(pos:Position):JSX.Element {
    
    return (
      <g className="card-icon">
        <rect x={pos.x+145} y={pos.y + 19} width="7" height="7" stroke="grey" fill="white" />
        <rect x={pos.x+152} y={pos.y + 19} width="7" height="7" stroke="grey" fill="white" />
        <rect x={pos.x+159} y={pos.y + 19} width="7" height="7" stroke="grey" fill="white" />
        <rect x={pos.x+152} y={pos.y + 12} width="7" height="7" stroke="grey" fill="white" />
        <rect x={pos.x+159} y={pos.y + 12} width="7" height="7" stroke="grey" fill="white" />
        <rect x={pos.x+159} y={pos.y + 5} width="7" height="7" stroke="grey" fill="white" />
      </g>
    )
  }
}

