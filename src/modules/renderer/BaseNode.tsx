import React, { MouseEventHandler, SVGProps } from "react";
import { ArchimateColors, ArchimateLayer } from "../enums/enumArchimateLayer";
import { NodeFamily } from "../enums/enumNodeFamily";
import { NodeDisplayInstance } from '../structure/Node'
import { NodeParameters } from "../structure/NodeParameters";
import { NodeAnchor } from "./NodeAnchor";
import { Position } from "../structure/Position";
import Helpers from "../utilities/Helpers";
import { NodeStatus } from "../enums/enumNodeStatus";

var helper = new Helpers();

export class BaseNode {
  constructor(node:NodeDisplayInstance, params:NodeParameters) {
    this.display = node
    this.params = params
    var z = helper.GetStyle(node.nodeData.nodeId, "z-index")
  }

  display: NodeDisplayInstance
  params: NodeParameters 
  layer:ArchimateLayer = ArchimateLayer.Technology
  addAnchorPos:Position ={x:-1, y:-1}
  
  setTop = () => {
    var el = document.getElementById(this.display.nodeData.nodeId)
    if(el) {
      el.style.zIndex="999"
      if(el.parentElement){ el.parentElement.appendChild(el)};
    }
  }

  removeTop = () => {
    var el = document.getElementById( this.display.nodeData.nodeId)
    if(el) {
      if(el.parentElement){ el.parentElement.insertBefore(el, el.parentElement.children[this.params.index])};
    }
  }

  setAddAnchorPosition(pos:Position) {
    this.addAnchorPos = pos;
    let el1:HTMLElement = document.getElementById("addanchor-line1") as HTMLElement;
    let el2:HTMLElement = document.getElementById("addanchor-line2") as HTMLElement;
    let x1 = pos.x -5
    let x2 = (pos.x + 5) 
    let y1 = pos.y -5
    let y2 = (pos.y + 5) 

    el1.setAttribute("x1", x1.toString())
    el1.setAttribute("x2", x2.toString())  
    el1.setAttribute("y1", y1.toString())
    el1.setAttribute("y2", y2.toString())  

    el2.setAttribute("x1", x2.toString())
    el2.setAttribute("x2", x1.toString())  
    el2.setAttribute("y1", y1.toString())
    el2.setAttribute("y2", y2.toString())  
  }

  Render():JSX.Element {

    let family:NodeFamily = NodeFamily.ActiveStructureElement; //default
    let layerStr=this.display.nodeData.type
    let layer:ArchimateLayer=ArchimateLayer.Technology
    if(this.display) {
      family = this.display.nodeData.family
    }

    let addAnchor = undefined

    if(this.display.status === NodeStatus.AddAnchor) {
      addAnchor = this.renderAddAnchor(this.display.position);
    } 

    let c:string = "node "
    switch(this.display.status) {
      case NodeStatus.Ready:
        c += "node-ready"
        break
      case NodeStatus.Locked:
        c += "node-locked"
        break
      case NodeStatus.Moving:
        c+= "node-moving"
        break
      case NodeStatus.AddAnchor:
        c += "node-add-anchor"
        break
    }

    return (
      <g id={this.display.id} key={this.display.nodeData.nodeId} data-node-id={this.display.nodeData.nodeId} onClick={this.nodeClick} onMouseDown={this.nodeDown} onPointerMove={this.nodeMove} onMouseUp={this.nodeUp} onMouseEnter={this.nodeEnter} onMouseLeave={this.nodeLeave} className={c}>
        { this.renderFrame(family, this.layer) }
        { addAnchor}
      </g>
    )
  }

  nodeEnter:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setHoverNode(e)
  }

  nodeLeave:MouseEventHandler<SVGGElement> = (e) => {
    if(this.display.status === NodeStatus.AddAnchor) {
      this.params.setReady(e)
    }
    this.params.clearHoverNode(e)
  }

  nodeClick:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setSelectedNode(e)
  }

  nodeDown:MouseEventHandler<SVGGElement> = (e) => {
    if(e.shiftKey) {
      this.params.addAnchor(e, this.addAnchorPos)
    } else if(this.display.status === NodeStatus.Ready) {
      this.setTop()
      this.params.startMoveNode(e)
    }
  }

  nodeMove:MouseEventHandler<SVGGElement> = (e) => {
   if(this.display.status === NodeStatus.Moving) {
      this.params.inMove(e)
    } else if(this.display.status === NodeStatus.Locked) {

    } else if(this.display.status === NodeStatus.Ready && e.shiftKey) {
      this.params.inAddAnchor(e)
    } else  if(this.display.status === NodeStatus.AddAnchor && e.shiftKey){
      let svg:SVGSVGElement = document.querySelector("svg") as SVGSVGElement
      const bbox = svg.getBoundingClientRect()
      let pt:Position = { x:e.clientX - bbox.left, y:e.clientY - bbox.top}
      let dx1 = pt.x - this.display.position.x
      let dx2 = this.display.position.x + 180 - pt.x
      let dy1 = pt.y - this.display.position.y
      let dy2 = this.display.position.y + 100 - pt.y

      if(dx1 < dx2 && dy1 < dy2) {
        if(dx1 > dy1) { pt.y = this.display.position.y}
        else { pt.x = this.display.position.x}
      } else if(dx1 > dx2 && dy1 < dy2) {
        if(dx2 > dy1) {pt.y = this.display.position.y}
        else { pt.x = this.display.position.x + 180}
      } else if(dx1 < dx2 && dy1 > dy2) {
        if(dx1 > dy2) {pt.y = this.display.position.y + 100}
        else { pt.x = this.display.position.x}
      } else if(dx1 > dx2 && dy1 > dy2) {
        if(dx2 > dy2) {pt.y = this.display.position.y + 100}
        else { pt.x = this.display.position.x + 180}
      }
   
      let pos:Position = { x: pt.x, y: pt.y}
      this.setAddAnchorPosition(pos)
    } else  if(this.display.status === NodeStatus.AddAnchor && !e.shiftKey){
      this.params.setReady(e)
    }
  }

  nodeUp:MouseEventHandler<SVGGElement> = (e) => {
    this.removeTop()
    this.params.endMoveNode(e)
  }

  renderIcon(pos:Position):JSX.Element {
    return (<g className="card-icon"></g>)
  }
  
  getBackgroundColor(layer:ArchimateLayer):string {

    let cbg:string = "#444"
    switch(layer) {
      case ArchimateLayer.Application:
        cbg = ArchimateColors.Application
        break
      case ArchimateLayer.Business:
        cbg = ArchimateColors.Business
        break
      // case ArchimateLayer.Composite:
      //   cbg = ArchimateColors.Composite
      //   break
      // case ArchimateLayer.ImplementationAndMigration:
      //   cbg = ArchimateColors.ImplementationAndMigration
      //   break
      case ArchimateLayer.Motivation:
        cbg = ArchimateColors.Motivation
        break
      case ArchimateLayer.Strategy:
        cbg = ArchimateColors.Strategy
        break
      case ArchimateLayer.Technology:
        cbg = ArchimateColors.Technology
        break
    }

    return cbg
  }

  renderAddAnchor(pos:Position):JSX.Element {
    
    let props:SVGProps<SVGSVGElement> = {}
    props.id = "addanchor"
    props.width = "20px"
    props.height = "20px"
    props.style = {}
    props.style.top = pos.y + "px"
    props.style.left = pos.x + "px"

    let x1 = pos.x -5
    let x2 = (pos.x + 5) 
    let y1 = pos.y -5
    let y2 = (pos.y + 5) 

    return <g>
      <line id="addanchor-line1" x1={x1} x2={x2} y1={y1} y2={y2} stroke="rgb(255,0,0)" strokeWidth="1"></line>
      <line  id="addanchor-line2" x1={x2} x2={x1} y1={y1} y2={y2} stroke="rgb(255,0,0)" strokeWidth="1"></line>
    </g>
  }

  renderFrame(family:NodeFamily, layer:ArchimateLayer):JSX.Element {
    let cbg:string = this.getBackgroundColor(layer)
    let anchors:Array<JSX.Element> = []

    if(this.display?.isSelected) {
      this.display.anchors.forEach((a) => {
        anchors.push(new NodeAnchor(this.display.id, a, this.display?.position.x, this.display?.position.y, this.params.anchorParams).render())
      })
    }

    let icon:JSX.Element = this.renderIcon(this.display.position);

    switch(this.display.nodeData.family) {
      case NodeFamily.ActiveStructureElement:
      case NodeFamily.PhysicalStructureNode: 
      case NodeFamily.CompositeElement:
        return (
          <g key={this.display.id}>
            <rect id={"n:" + this.display.id} className="node" x={this.display?.position.x} y={this.display?.position.y} width="180" height="100" fill={cbg} stroke="grey" data-node-id={this.display.nodeData.nodeId} data-element="frame"  />
            <foreignObject x={this.display?.position.x + 10} y={this.display?.position.y + 5} width="130" height="50">
              <p className="nodeName" >{this.display?.nodeData.name}</p>
            </foreignObject>
            { anchors }
            { icon }
          </g>
        )
        break
      case NodeFamily.PassiveStructureElement:
        let p2 = "M" + (this.display?.position.x) + " " + (this.display?.position.y + 20)
        p2+= " h180" 
        return ( 
          <g key={this.display.id} >
            <rect id={"n:" + this.display.id} className="node" x={this.display?.position.x} y={this.display?.position.y} width="180" height="100" fill={cbg} stroke="grey" data-node-id={this.display.nodeData.nodeId} data-element="frame"  />
            <path d={p2} fill="none" stroke="grey" strokeWidth="1px" data-node-id={this.display.nodeData.nodeId} />
            <foreignObject x={this.display?.position.x + 10} y={this.display?.position.y + 5} width="130" height="50">
              <p className="nodeName" >{this.display?.nodeData.name}</p>
            </foreignObject>
            { anchors }
            { icon }
          </g>
        )
        break
      case NodeFamily.BehaviorElement:
        let p:string = "M" + (this.display.position.x + 10) + " " + this.display.position.y 
        p+= " H" + (this.display.position.x + 170) 
        p+= " Q" + (this.display.position.x + 180) + ", " + this.display.position.y + " " + (this.display.position.x + 180) + ", " + (this.display.position.y + 10)
        p+= " v" + 80
        p+= " Q" + (this.display.position.x + 180) + ", " + (this.display.position.y + 100) + " " + (this.display.position.x + 170) + ", " + (this.display.position.y + 100)
        p+= " H" + (this.display.position.x + 10)
        p+= " Q" + (this.display.position.x) + ", " + (this.display.position.y + 100) + " " + (this.display.position.x) + ", " + (this.display.position.y + 90)
        p+= " v" + -80 
        p+= " Q" + (this.display.position.x) + ", " + (this.display.position.y) + " " + (this.display.position.x + 10) + ", " + (this.display.position.y)
        return (
          <g key={this.display.id}>
            <path  id={"n:" + this.display.id} d={p} fill={cbg} stroke="grey" data-node-id={this.display.nodeData.nodeId} data-element="frame"/>
            <foreignObject x={this.display?.position.x + 10} y={this.display?.position.y + 5} width="130" height="50">
              <p className="nodeName" >{this.display?.nodeData.name}</p>
            </foreignObject>
            { anchors }
            { icon }
          </g>
        )
        break
      case NodeFamily.MotivationElement:
        let p3:string = "M" + (this.display.position.x + 10) + " " + this.display.position.y 
        p3+= " h160"
        p3+= " l10 10"
        p3+= " v80"
        p3+= " l-10 10"
        p3+= " h-160"
        p3+= " l-10 -10"
        p3+= " v-80"
        p3+= " l10 -10"
        return (
          <g key={this.display.id} >
            <path id={"n:" + this.display.id} d={p3} fill={cbg} stroke="grey" data-node-id={this.display.nodeData.nodeId} data-element="frame"  />
            <foreignObject x={this.display?.position.x + 10} y={this.display?.position.y + 5} width="130" height="50">
              <p className="nodeName" >{this.display?.nodeData.name}</p>
            </foreignObject>
            { icon }
            { anchors }
          </g>
        )
    }
  }
}