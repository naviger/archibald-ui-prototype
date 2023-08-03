import { MouseEventHandler } from "react";
import { AnchorStatus } from "../enums/enumAnchorStatus";
import { NodeAnchorParameters } from "../structure/NodeAnchorParameters";
import { NodeAnchorData } from "../structure/NodeAnchorData";
import { Color } from "../utilities/Color";

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
    this.params.setHover(e.currentTarget.id)
  }

  anchorLeave:MouseEventHandler<SVGGElement> = (e) => {
    this.params.clearHover(e.currentTarget.id)
  }

  anchorMouseDown:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setSelectedAnchor(e.currentTarget.id, e.shiftKey)
    e.stopPropagation()
  }

  anchorMouseUp:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setNewEdgeEndPoint(e.currentTarget.id)
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

    return (
      <circle id={this.nodeId + ":" + this.data.id}  key={this.data.id} data-node-anchor-id={this.data.id} cx={this.offsetX + this.data.position.x} cy={this.offsetY + this.data.position.y} 
        r="5" fill={fill} stroke="navy" onMouseEnter={this.anchorEnter} onMouseLeave={this.anchorLeave} onMouseDown={this.anchorMouseDown} onMouseUp={this.anchorMouseUp}
      >
      </circle>
    )
  }
}