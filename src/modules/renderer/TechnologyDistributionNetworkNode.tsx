import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyDistributionNetworkNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    return (
      <g className="card-icon">
        <polyline points={"" + (pos.x + 142)+  ", " + (pos.y + 5) + " " + (pos.x + 134) + ", " + (pos.y + 15) + " " + (pos.x + 142) + ", " + (pos.y + 25) }  stroke="grey" fill="none" strokeWidth="2" />
        <polyline points={"" + (pos.x + 158)+  ", " + (pos.y + 5) + " " + (pos.x + 166) + ", " + (pos.y + 15) + " " + (pos.x + 158) + ", " + (pos.y + 25) }  stroke="grey" fill="none" strokeWidth="2" />
        <line x1={pos.x + 136} x2={pos.x + 162} y1={pos.y + 12} y2 ={pos.y + 12} stroke="grey" strokeWidth="2" />
        <line x1={pos.x + 136} x2={pos.x + 162} y1={pos.y + 18} y2 ={pos.y + 18} stroke="grey" strokeWidth="2" />
      </g>
    )
  }
}
