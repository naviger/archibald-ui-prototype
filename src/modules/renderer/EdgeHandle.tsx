import { MouseEventHandler } from "react";
import { Color } from "../utilities/Color";
import { EdgeAnchorStatus } from "../enums/enumEdgeAnchorStatus";
import { EdgeConstraints } from "../enums/enumEdgeConstraints";
import { EdgeHandleParameters } from "../structure/EdgeHandleParameters";
import { Position } from "../structure/Position";

export class EdgeHandle {
  constructor(id:string, offset:Position, pivot:Position, params:EdgeHandleParameters, status: EdgeAnchorStatus, constraints: EdgeConstraints) {
    this.id = id
    this.offset = offset
    this.pivot = pivot
    this.params = params
    this.status = status
    this.constraints = constraints
  }

  id:string
  offset:Position
  pivot:Position
  params:EdgeHandleParameters
  status:number
  constraints:number

  handleMouseDown:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setSelectedHandle(e.currentTarget.id, e.shiftKey, {x:e.clientX, y:e.clientY })
  }

  handleMouseMove:MouseEventHandler<SVGGElement> = (e) => {
    this.params.moveHandle(e.currentTarget.id)
  }

  handleMouseUp:MouseEventHandler<SVGGElement> = (e) => {
    this.params.endMoveHandle(e.currentTarget.id)
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

    let c:string = "handle"

    return (
      <g id={this.id} key={this.id}>
        <line id={this.id + ':L'} className="edge-handle-line" x1={this.offset.x} y1={this.offset.y} x2={this.pivot.x} y2={this.pivot.y} stroke='silver' strokeDasharray="4 2" />
        <circle id={this.id + ':C'} className={c} key={this.id} data-edge-anchor-id={this.id}  data-status={this.status} data-constraint={this.constraints} 
          rx="3" ry="3" cx={this.offset.x -3} cy={this.offset.y -3 } 
          r="5" fill="green" stroke="green" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} 
        /> 
      </g>
    )
  }
}