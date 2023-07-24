import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class BusinessRoleNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Business
  
  renderIcon(pos:Position):JSX.Element {
    let p: string = "M" + (pos.x + 145)+ ", " + (pos.y + 5)
    p+= " h 20"
    p+= " Q" + (pos.x + 170) + ", " + (pos.y + 7) + " " + (pos.x + 170) + ", " + (pos.y + 15)
    p+= " Q" + (pos.x + 170) + ", " + (pos.y + 23) + " " + (pos.x + 165) + ", " + (pos.y + 25)
    p+= " h -20"
    p+= " Q" + (pos.x + 140) + ", " + (pos.y + 23) + " " + (pos.x + 140) + ", " + (pos.y + 15)
    p+= " Q" + (pos.x + 140) + ", " + (pos.y + 7) + " " + (pos.x + 145) + ", " + (pos.y + 5)
   
    let p2: string =  p+= " M" + (pos.x + 165) + ", " + (pos.y + 5)
    p2+= " Q" + (pos.x + 160) + ", " + (pos.y + 7) + " " + (pos.x + 160) + ", " + (pos.y + 15)
    p2+= " Q" + (pos.x + 160) + ", " + (pos.y + 23) + " " + (pos.x + 165) + ", " + (pos.y + 25)

    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p} />
        <path fill="none" stroke="grey" d={p2} />
      </g>
    )
  }
}

