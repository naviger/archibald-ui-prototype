import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyCommunicationNetworkNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +145) + " " + (pos.y + 5)
    p1+= "l-5 5 l5, 5"
    p1+= "m-5 -5"
    p1+= "h 20"
    p1+= "m-5 -5"
    p1+= "l5 5 -5, 5"
    
    const p = "" + (pos.x + 150) + ", " + (pos.y + 10) 
              + " " + (pos.x + 165) + ", " + (pos.y + 10) 
              + " " + (pos.x + 160 ) + ", " + (pos.y + 25) 
              + " " + (pos.x + 145) + ", " + (pos.y + 25) 
              + " " + (pos.x + 150) + ", " + (pos.y + 10)
    return (
      <g className="card-icon">
        <circle r="3" cx={pos.x + 150} cy = {pos.y + 10 } fill="black"></circle>
        <circle r="3" cx={pos.x + 165} cy = {pos.y + 10 } fill="black"></circle>
        <circle r="3" cx={pos.x + 160} cy = {pos.y + 25 } fill="black"></circle>
        <circle r="3" cx={pos.x + 145} cy = {pos.y + 25} fill="black"></circle>
        <polyline points={p} fill="none" stroke="black" strokeWidth={1}/>
      </g>
    )
  }
}
