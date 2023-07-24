import { ArchimateLayer } from "../enums/enumArchimateLayer";
import { BaseNode } from "./BaseNode";
import { Position } from "../structure/Position";

export class StrategyResourceNode extends BaseNode {
  layer:ArchimateLayer = ArchimateLayer.Strategy
  
  renderIcon(pos:Position):JSX.Element {
    
    return (
      <g className="card-icon">
        <rect x={this.display.position.x + 166} y={this.display.position.y + 9.5} height="9" width="6" rx="2"  fill="white" stroke="grey" />
        <rect x={this.display.position.x + 140} y={this.display.position.y + 5} height="18" width="28" rx="4"  fill="white" stroke="grey" />
        <line x1={this.display.position.x + 146} y1={this.display.position.y + 9} x2={this.display.position.x + 146} y2={this.display.position.y + 19} fill="none" stroke="grey" />
        <line x1={this.display.position.x + 149} y1={this.display.position.y + 9} x2={this.display.position.x + 149} y2={this.display.position.y + 19} fill="none" stroke="grey" />
        <line x1={this.display.position.x + 152} y1={this.display.position.y + 9} x2={this.display.position.x + 152} y2={this.display.position.y + 19} fill="none" stroke="grey" />
      </g>
    )
  }
}

