import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyArtifactNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 5)
    p1+= "h10 l5 5 v15 h-15 v-20" 
    p1+= "m 10 0 v5 h5"
        
    return (
      <g className="card-icon">
        <path fill="white" stroke="grey" d={p1} />
      </g>
    )
  }
}

