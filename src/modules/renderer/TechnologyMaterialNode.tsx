import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyMaterialNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p:string = "" + (pos.x + 143) + "," + (pos.y + 5) + " "
    p += (pos.x + 157) + "," + (pos.y + 5) + " "
    p += (pos.x + 165) + "," + (pos.y + 17) + " "
    p += (pos.x + 157) + "," + (pos.y + 29) + " "
    p += (pos.x + 143) + "," + (pos.y + 29) + " "
    p += (pos.x + 135) + "," + (pos.y + 17) + " "
    p += (pos.x + 143) + "," + (pos.y + 5) + " "
     
    
    return (
      <g className="card-icon">
        <polyline points ={p} fill="white" stroke="grey" strokeWidth="1" />
        <line x1={pos.x + 153} x2={ pos.x + 159} y1={pos.y + 9} y2={pos.y + 17} stroke="grey" strokeWidth="1" />
        <line x1={pos.x + 144} x2={ pos.x + 155} y1={pos.y + 25} y2={pos.y + 25} stroke="grey" strokeWidth="1" />
        <line x1={pos.x + 147} x2={ pos.x + 142} y1={pos.y + 9} y2={pos.y + 17} stroke="grey" strokeWidth="1" />
      </g>
    )
  }
}
