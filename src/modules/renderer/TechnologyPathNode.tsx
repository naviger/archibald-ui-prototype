import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyPathNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 5)
    p1+= "l-5 5 l5, 5"
    p1+= "m10 -10"
    p1+= "l5 5 -5, 5"

    let p2:string =  "M" + (pos.x +140) + " " + (pos.y + 10)
    p2+= "h20"
        
    return (
      <g className="card-icon">
        <path fill="none" stroke="grey" strokeWidth="2" d={p1} />
        <path fill="none" stroke="grey" strokeWidth="2" strokeDasharray="2" d={p2} />
      </g>
    )
  }
}
