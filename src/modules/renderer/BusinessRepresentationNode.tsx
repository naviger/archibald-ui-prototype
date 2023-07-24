import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { NodeFamily } from "../enums/enumNodeFamily";
import { NodeAnchor } from "./NodeAnchor";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";
import { MouseEventHandler } from "react";
import { NodeStatus } from "../enums/enumNodeStatus";

export class BusinessRepresentationNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Business
  
  renderFrame(family:NodeFamily, layer:ArchimateLayer):JSX.Element {

    const cbg: string = this.getBackgroundColor(this.layer)

    let anchors:Array<JSX.Element> = []

    if(this.display?.isSelected) {
      this.display.anchors.forEach((a) => {
        anchors.push(new NodeAnchor(this.display.id, a, this.display?.position.x, this.display?.position.y, this.params.anchorParams).render())
      })
    }
    
    let p1:string = "M" + (this.display.position.x) + " " + this.display.position.y 
    p1+= "h180 v90 "
    p1+= "c-20,15 -70,15 -90,0 "
    p1+= "c -20,-15 -70,-15 -90,0 "
    p1+= "v -90 " 

    let p2 = "M" + (this.display?.position.x) + " " + (this.display?.position.y + 20)
    p2+= " h180" 

    return (
      <g className="card-icon">
        <path id={"n:" + this.display.id} d={p1} fill={cbg} stroke="grey" strokeWidth="1px" data-node-id={this.display.nodeData.nodeId} data-element="frame"/>
        <path d={p2} fill="none" stroke="grey" strokeWidth="1px" />
        <foreignObject x={this.display?.position.x + 10} y={this.display?.position.y + 5} width="130" height="50">
          <p className="nodeName" >{this.display?.nodeData.name}</p>
        </foreignObject>
        { anchors }
      </g>
    )
  }
}

