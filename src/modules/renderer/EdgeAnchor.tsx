import { MouseEventHandler } from "react";
import { JsxElement } from "typescript";
//import {color} from "../Archimate/archimateNodes";
// import { AnchorStatus } from "../enums/enumAnchorStatus";
import { EdgeAnchorParameters } from "../structure/EdgeAnchorParameters";
// import { EdgeAnchorData } from "../structure/EdgeAnchorData";
// import { INodeDisplayInstance } from "../structure/INode";
import { Color } from "../utilities/Color";
import { EdgeAnchorStatus } from "../enums/enumEdgeAnchorStatus";
import { EdgeConstraints } from "../enums/enumEdgeConstraints";
import { Position } from "../structure/Position";

export class EdgeAnchor {
  constructor(id:string, offset:Position, params:EdgeAnchorParameters, status: EdgeAnchorStatus, constraints: EdgeConstraints) {
    //this.data = data
    this.id = id
    this.offset = offset
    this.params = params
    this.status = status
    this.constraints = constraints
  }

  id:string
  offset:Position
  params:EdgeAnchorParameters
  status:number
  constraints:number

  anchorMouseDown:MouseEventHandler<SVGGElement> = (e) => {
    this.params.selectAnchor(e)
  }

  anchorMouseMove:MouseEventHandler<SVGGElement> = (e) => {
    this.params.moveAnchor(e)
  }

  anchorMouseUp:MouseEventHandler<SVGGElement> = (e) => {
    this.params.dropAnchor(e)
  }

  render():JSX.Element {
    let fill:Color<string> = "white" 

    switch(this.status) {
      case EdgeAnchorStatus.Locked:
        fill = "red";
        break
      case EdgeAnchorStatus.Free:
        fill = "blue"
      break;
    }

    let c:string = "edge-anchor anchor-no-move"
    if(this.status == EdgeAnchorStatus.Free) {
      if(this.constraints === EdgeConstraints.Vertical) {
        c = "edge-anchor anchor-move-vert"
      }
      else if(this.constraints === EdgeConstraints.Horizontal) {
        c = "edge-anchor anchor-move-horz"
      } else if(this.constraints === EdgeConstraints.None){
        c = "edge-anchor anchor-move"
      }
    } else {

    }

    return (
      <rect className={c} id={this.id} key={this.id} data-edge-anchor-id={this.id}  data-status={this.status} data-constraint={this.constraints} 
        width="6" height = "6" x={this.offset.x -3} y={this.offset.y -3 } r="5" fill={fill} stroke="navy"  
        onMouseDown={this.anchorMouseDown} onMouseMove={this.anchorMouseMove} onMouseUp={this.anchorMouseUp}
      />
    )
  }
}