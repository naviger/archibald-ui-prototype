import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyProcessNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p:string = "M" + (pos.x +140) + " " + (pos.y + 15)
    p+="h 20"
    p+="v -5"
    p+="l 10 10"
    p+="l -10 10"
    p+="v-5"
    p+="h -20"
    p+="v -10"

    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p} />
      </g>
    )
  }
}

