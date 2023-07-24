import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class TechnologyDeviceNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Technology
  
  renderIcon(pos:Position):JSX.Element {
    let p:string = "M" + (this.display.position.x + 145) + " " + (this.display.position.y + 20)
    p+= " h15" 
    p+= " a5 5 0 0 0 5 5"
    p+= " h-25"
    p+= " a5,-5 0 0 0 5,-5"

    return (
      <g className="card-icon">
        <rect x={this.display.position.x + 140} y={this.display.position.y + 5} height="15" width="25" rx="4"  fill="white" stroke="grey" ></rect>
        {/* <path fill="white" stroke="grey" d={p1} /> */}
        <path fill="white" stroke="grey" d={p} />
      </g>
    )
  }
}
