import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyFacilityNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p:string = "" + (pos.x + 140) + "," + (pos.y + 5) + " "
    p += (pos.x + 144) + "," + (pos.y + 5) + " "
    p += (pos.x + 144) + "," + (pos.y + 20) + " "
    p += (pos.x + 152) + "," + (pos.y + 16) + " "
    p += (pos.x + 152) + "," + (pos.y + 20) + " "
    p += (pos.x + 160) + "," + (pos.y + 16) + " "
    p += (pos.x + 160) + "," + (pos.y + 20) + " "
    p += (pos.x + 170) + "," + (pos.y + 16) + " "
    p += (pos.x + 170) + "," + (pos.y + 29) + " "
    p += (pos.x + 140) + "," + (pos.y + 29) + " "
    p += (pos.x + 140) + "," + (pos.y + 5) + " "
     
    return (
      <g className="card-icon">
        <polyline points={p} fill="white" stroke="grey" />
      </g>
    )
  }
}
