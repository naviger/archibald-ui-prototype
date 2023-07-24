import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyNodeNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 10)
    p1+= "l5 -5 "
    p1+= "h15 "
    p1+= "v15 "
    p1+= "l-5 5 "
    p1+= "v-15 "
    
    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p1} />
        <rect x={pos.x + 145} y={pos.y+10} width="15" height={"15"} stroke="grey" fill="white" />
        <line x1={pos.x + 160} y1={pos.y+10} x2={pos.x+165} y2={pos.y+6} stroke="grey" />
      </g>
    )
  }
}
