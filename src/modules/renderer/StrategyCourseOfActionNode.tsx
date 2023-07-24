import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class StrategyCourseOfActionNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Strategy
  
  renderIcon(pos:Position):JSX.Element {
    let p1:string = "M" + (pos.x +138) + " " + (pos.y + 20)
    p1+= " l8 0 l 0 8 l-8 -8 "
    let p2:string = "M" + (pos.x +137) + " " + (pos.y + 35)
    p2+= " a10,10 90 0, 1 " + (5) + "," + (-12)


    return (
      <g className="card-icon">
        <circle cx={pos.x + 155} cy={pos.y + 20 } r="11" fill="white" strokeWidth="1" stroke="grey" />
        <circle cx={pos.x + 155} cy={pos.y + 20 } r="7" fill="white" strokeWidth="1" stroke="grey" />
        <circle cx={pos.x + 155} cy={pos.y +20} r="3" fill="grey" strokeWidth="2" stroke="grey" />
        <path fill="black" stroke="grey" strokeWidth="0" d={p1} />
        <path fill="none" stroke="black" strokeWidth="2" d={p2} />
      </g>
    )
  }
}

