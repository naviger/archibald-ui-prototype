import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class BusinessServiceNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Business
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 25)
    p1+= "A 10 10 90 0 1 " + (pos.x + 145) + " " + (pos.y + 5)
    p1+= "h 15"
    p1+= "A 10 10 90 0 1 " + (pos.x + 160) + " " + (pos.y + 25)
    p1+= "h -15"
        
    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p1} />
      </g>
    )
  }
}

