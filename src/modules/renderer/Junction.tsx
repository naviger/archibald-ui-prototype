
import React, { MouseEventHandler } from "react";
import { JunctionType } from "../enums/enumJunctionType";
import { Position } from "../structure/Position";
import { JunctionAnchorData } from "../structure/JunctionAnchorData";
import { FlowDirection } from "../enums/enumFlowDirection";
import { JunctionParameters } from "../structure/JunctionParameters";
import { JunctionDisplayInstance } from "../structure/Junction";
import { AnchorStatus } from "../enums/enumAnchorStatus";



export class Junction {
  id:string
  type:JunctionType
  isSelected: boolean
  position:Position
  anchors:JunctionAnchorData[]
  showAnchors:boolean 
  params:JunctionParameters
  r:number = 10

  constructor(junction:JunctionDisplayInstance, params:JunctionParameters) {
    this.id = junction.id
    this.type = junction.type
    this.isSelected = junction.isSelected
    this.position = junction.position
    this.anchors = junction.anchors as Array<JunctionAnchorData>
    this.showAnchors = junction.showAnchors
    this.params = params
  }

  anchorMouseOver: MouseEventHandler<SVGGElement> = (e) => {
    e.currentTarget.setAttribute("stroke", "green" )
    e.currentTarget.setAttribute("stroke-width", "2" )
    e.stopPropagation()
  }

  anchorMouseOut: MouseEventHandler<SVGGElement> = (e) => {
    e.currentTarget.setAttribute("stroke", "grey" )
    e.currentTarget.setAttribute("stroke-width", "1" )

    e.stopPropagation()
  }

  anchorMouseUp: MouseEventHandler<SVGGElement> = (e) => {
    this.params.dropOnAnchor(e.currentTarget.id, e.shiftKey)
  }

  anchorMouseDown: MouseEventHandler<SVGGElement> = (e) => {
    this.params.clickOnAnchor(e.currentTarget.id, e.shiftKey)
  }

  mouseUp:MouseEventHandler<SVGGElement> = (e) => {
    this.params.drop()
  }

  mouseDown:MouseEventHandler<SVGGElement> = (e) => {
    let bbox = e.currentTarget.getBoundingClientRect()
    this.params.setSelected(e.currentTarget.id.split(":")[0], {x:e.pageX, y:e.pageY}, {x:e.pageX - this.position.x, y:e.pageY - this.position.y })
  }

  mouseOver:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setHover(e.currentTarget.id.split(":")[0])
  }

  mouseMove:MouseEventHandler<SVGGElement> = (e) => {
    if(!this.showAnchors) { this.showAnchors = true }
    this.params.move({x: e.pageX, y:e.pageY})
  }

  mouseOut:MouseEventHandler<SVGGElement> = (e) => {
    if((e.pageX < this.position.x - (this.r+4) || e.pageX > this.position.x + (this.r+4)) || (e.pageY < this.position.y - (this.r+4) || e.pageY > this.position.y + (this.r+4))) {
      this.params.clearHover(e.currentTarget.id.split(":")[0])
    }
  }

  Render():React.JSX.Element { 
    let fill:string="white"
    let text:string = "|"
    let color:string = "black"
    if(this.type===JunctionType.And) { 
      fill="black"
      text = "&"
      color = "white"
    }

    let anchors:React.JSX.Element[] = []
    
    if(this.showAnchors) {
      anchors = this.anchors.map((a) => {
        let fill:string = "white"
        if(a.status === AnchorStatus.Occupied && a.flow === FlowDirection.In) {
          fill = "#ffbf00"
        } else  if(a.status === AnchorStatus.Occupied && a.flow === FlowDirection.Out) {
          fill = "#00ff90"
        }
        return (
          <rect className="junction-anchor" id={this.id + ":" + a.id} key={this.id + ":" + a.id} x={this.position.x + a.position.x - 4} y={this.position.y + a.position.y - 4} height="8" width="8" fill={fill} stroke='grey' strokeWidth='1' onMouseDown={this.anchorMouseDown} onMouseUp={this.anchorMouseUp} onMouseEnter={this.anchorMouseOver} onMouseLeave={this.anchorMouseOut} />
        )
      })
    }

    return (
      <g  key={this.id} >
        <circle id={this.id + ":shadow"} className="junction-shadow" cx={this.position.x} cy={this.position.y} r={this.r + 4} fill="green" fillOpacity="0.1" stroke="none" strokeWidth="1" />
        <circle id={this.id} className={"junction" + (this.type===JunctionType.And ? " and" : " or")} cx={this.position.x } cy={this.position.y} r={this.r} fill={fill} stroke="grey" strokeWidth="1"  />
        <circle id={this.id + ":mousehandler"} className="junction-shadow" cx={this.position.x} cy={this.position.y} r={this.r + 4} fill="green" fillOpacity="0.0" stroke="none" strokeWidth="1" onMouseOver={this.mouseOver} onMouseMove={this.mouseMove} onMouseOut={this.mouseOut} onMouseDown={this.mouseDown}  onMouseUp={this.mouseUp}/>
        {anchors} 
      </g>
    )
  }

}