import { MouseEventHandler } from "react";
// import { JsxElement } from "typescript";
//import {color} from "../Archimate/archimateNodes";
import { AnchorStatus } from "../enums/enumAnchorStatus";
import { NodeAnchorParameters } from "../structure/NodeAnchorParameters";
import { NodeAnchorData } from "../structure/NodeAnchorData";
// import { NodeDisplayInstance } from "../structure/Node";
import { Color } from "../utilities/Color";
import { Position } from "../structure/Position";
// import { EdgeDirection } from "../enums/enumEdgeDirection";

export class NodeAnchor {
  constructor(nodeId:string, data:NodeAnchorData, offsetX:number, offsetY:number, params:NodeAnchorParameters) {
    this.nodeId = nodeId
    this.data = data
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.params = params
  }

  nodeId:string 
  data:NodeAnchorData
  offsetX:number
  offsetY:number
  params:NodeAnchorParameters

  anchorEnter:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setHoverAnchor(e)
  }

  anchorLeave:MouseEventHandler<SVGGElement> = (e) => {
    this.params.clearHoverAnchor(e)
  }

  anchorMouseDown:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setSelectedAnchor(e)
  }

  anchorMouseUp:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setNewEdgeEndPoint(e)
  }

  anchorMove:MouseEventHandler<SVGGElement> = (e) => {
    let pos: Position = {x:0, y:0}
    this.params.dragNewEdge(e, pos);
  }

  render():JSX.Element {
    let fill:Color<string> = "white" 

    switch(this.data.status) {
      case AnchorStatus.Locked:
        fill = "black";
        break
      case AnchorStatus.Occupied:
        fill = "aquamarine"
      break;
    }

    if(this.data.id==="0") {console.log(this.data)}

    return (
      <circle id={this.nodeId + ":" + this.data.id}  key={this.data.id} data-node-anchor-id={this.data.id} cx={this.offsetX + this.data.position.x} cy={this.offsetY + this.data.position.y} 
        r="5" fill={fill} stroke="navy" onMouseEnter={this.anchorEnter} onMouseLeave={this.anchorLeave} onMouseDown={this.anchorMouseDown} onMouseUp={this.anchorMouseUp}
      >
      </circle>
    )
  }
}