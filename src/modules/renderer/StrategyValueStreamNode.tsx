import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class StrategyValueStreamNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Strategy
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +140) + " " + (pos.y + 5)
    p1+= "h15 l7 10 l-7 10 h -15 l7 -10 l-7 -10"
    return (
      <g className="card-icon">
         <path fill="white" stroke="grey" d={p1} />
      </g>
    )
  }
}

