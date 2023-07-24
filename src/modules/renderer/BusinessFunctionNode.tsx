import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class BusinessFunctionNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Business
  
  renderIcon(pos:Position):JSX.Element {
    let p:string = "M" + (pos.x +145) + " " + (pos.y + 15)
    p+= "l 10 -5"
    p+= "l 10 5"
    p+= "v 10"
    p+= "l -10 -5"
    p+= "l -10 5"
    p+= "v -10"

    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p} />
      </g>
    )
  }
}

