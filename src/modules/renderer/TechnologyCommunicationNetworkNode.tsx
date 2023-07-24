import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyCommunicationNetworkNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 5)
    p1+= "l-5 5 l5, 5"
    //p1+= "l-5 5 l5, 5"
    p1+= "m-5 -5"
    p1+= "h 20"
    p1+= "m-5 -5"
    p1+= "l5 5 -5, 5"
    
    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" strokeWidth="2" d={p1} />
      </g>
    )
  }
}
