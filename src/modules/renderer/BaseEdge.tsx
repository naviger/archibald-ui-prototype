import { MouseEventHandler } from "react";
import { EdgeLayout } from "../enums/enumEdgeLayout";
import { EdgeDisplayInstance } from "../structure/Edge";
import { Position } from "../structure/Position"
import { EdgeDirection } from "../enums/enumEdgeDirection";
import { EdgeParameters } from "../structure/EdgeParameters";
import { EdgeAnchor } from "./EdgeAnchor";
import { EdgeAnchorStatus } from "../enums/enumEdgeAnchorStatus";
import { EdgeConstraints } from "../enums/enumEdgeConstraints";
import Helpers from "../utilities/Helpers";
import { EdgeHandle } from "./EdgeHandle";
import { getEndDecoration } from "./EndDecorations";
import { StyleObject } from "../structure/StyleObject";
import { getStartDecoration } from "./StartDecorations";

let helpers = new Helpers();

export class BaseEdge {
  strokeColor:string = 'black'
  strokeStyle:string = 'solid'
  strokeSize:string = '1'
  params: EdgeParameters


  constructor(data:EdgeDisplayInstance, params: EdgeParameters) {
    this.display = data
    this.strokeColor = data.style.color
    this.strokeStyle = data.style.style
    this.strokeSize = data.style.weight
    this.params = params
  }

  setTop = () => {
    var el = document.getElementById(this.display.edgeData.edgeId)
    if(el && el.style) {
      el.style.zIndex="999"
      if(el.parentElement){ el.parentElement.appendChild(el)};
    }
  }

  removeTop = () => {
    var el = document.getElementById( this.display.edgeData.edgeId)
    if(el) {
      if(el.parentElement){ el.parentElement.insertBefore(el, el.parentElement.children[this.params.index as number])};
    }
  }

  edgeEnter:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setHover(e.currentTarget.id)
  }

  edgeLeave:MouseEventHandler<SVGGElement> = (e) => {
    this.params.clearHover(e.currentTarget.id)
  }

  edgeClick:MouseEventHandler<SVGGElement> = (e) => {
    this.params.setSelectedEdge(e.currentTarget.id, e.shiftKey, {x:e.clientX, y:e.clientY})
  }

  edgeDown:MouseEventHandler<SVGGElement> = (e) => {
    this.setTop()
  }

  edgeMove:MouseEventHandler<SVGGElement> = (e) => {
  }

  edgeUp:MouseEventHandler<SVGGElement> = (e) => {
    this.params.dragDone(e)
    this.removeTop()
  }

  display: EdgeDisplayInstance

  Render():JSX.Element {
    let p:string = ""
    let anchors:Array<JSX.Element> = []
    let handles:Array<JSX.Element> = []
    let start:JSX.Element = <circle cx={-3} cy={-3} r={3} fill='black' />
    let end:JSX.Element = <circle cx={-3} cy={-3} r={3} fill='black' />
    
    end = <circle cx={-3} cy={-3} r={3} fill='black' />
    let i:number = 0;
    let ptprev:Position = this.display.route[0]

    const styles:StyleObject = {
      fill:this.strokeColor,
      strokeColor:this.strokeColor,
      strokeSize:this.strokeSize,
      strokeStyle: helpers.getLineStyle(this.display.edgeData.type, this.strokeStyle)
    }

    switch(this.display.style.layout) {
      case EdgeLayout.Straight: 
        let s:Position = this.display.route[0] as Position
        let e:Position = this.display.route[1] as Position
    
        if(this.display.isSelected) {
          anchors.push(new EdgeAnchor(this.display.id + ":0", s, this.params.anchorParams, EdgeAnchorStatus.Locked, EdgeConstraints.None && EdgeConstraints.EndAnchor).render())
          anchors.push(new EdgeAnchor(this.display.id + ":1", e, this.params.anchorParams, EdgeAnchorStatus.Locked, EdgeConstraints.None && EdgeConstraints.EndAnchor).render())
        }
        p = "" + s.x + ", " + s.y + " " + e.x + ", " + e.y
        let theta:number = helpers.getStraightAngle(s, e)
        start = getStartDecoration(this.display.id, this.display.edgeData.type, s, e, theta, styles)
        end = getEndDecoration(this.display.id, this.display.edgeData.type, e, e, theta, styles)
        return (
          <g key={this.display.id} id={this.display.id} >
            <polyline id={this.display.id + ":bg"} className="edge-ptr" points={p} data-edge-id={this.display.edgeData.edgeId} data-element='connector' strokeWidth="10" strokeOpacity="0.1" strokeDasharray={this.strokeStyle} stroke={this.strokeColor} fill="none" onClick={this.edgeClick} onMouseEnter={this.edgeEnter} onMouseLeave={this.edgeLeave} onMouseUp={this.edgeUp}/>
            <polyline id={this.display.id + ":edge"} className="edge display-edge" points={p} data-edge-id={this.display.edgeData.edgeId} data-element='connector' width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill="none" />
            { start }
            { end }
            { anchors }
          </g>
        )
        break
      case EdgeLayout.NinetyDegree:
        i=0
        this.display.route.forEach((pt:Position) => {    
            if(i === 0) {
              let ea0:EdgeAnchor = new EdgeAnchor(this.display.id + ":0", {x: pt.x, y:pt.y}, this.params.anchorParams, EdgeAnchorStatus.Locked, EdgeConstraints.EndAnchor)
              anchors.push(ea0.render())
            } else {
              let status = EdgeAnchorStatus.Free
              let constraints:EdgeConstraints|undefined = undefined
              if(i === this.display.route.length -1) {
                status = EdgeAnchorStatus.Locked
                constraints = EdgeConstraints.EndAnchor
              }
              
              if(ptprev.x === pt.x ) { 
                if(constraints!=undefined) {
                  constraints =  constraints | (i === 1 ? EdgeConstraints.Horizontal: i === this.display.route.length - 2 ? EdgeConstraints.Vertical : EdgeConstraints.None)
                } else {
                  constraints =  i === 1 ? EdgeConstraints.Horizontal: i === this.display.route.length - 2 ? EdgeConstraints.Vertical : EdgeConstraints.None
                }
                let ea1:EdgeAnchor = new EdgeAnchor(this.display.id + ":"+ i, {x: pt.x, y:pt.y}, this.params.anchorParams, status, 
                constraints )

                let ea2:EdgeAnchor = new EdgeAnchor(this.display.id + ":"+ ((i-1) + .5), {x: pt.x, y:(ptprev.y + pt.y)/2}, this.params.anchorParams, EdgeAnchorStatus.Free, i === 1 || i === this.display.route.length -1 ? EdgeConstraints.Horizontal | EdgeConstraints.Vertical : EdgeConstraints.Vertical)

                anchors.push(ea2.render())
                anchors.push(ea1.render())
              } else if(ptprev.x != pt.x ) {  
                if(constraints!=undefined) {
                  constraints =  constraints | (i === 1  ? EdgeConstraints.Vertical: i === this.display.route.length - 2 ? EdgeConstraints.Horizontal : EdgeConstraints.None)
                } else {
                  constraints =   i === 1  ? EdgeConstraints.Vertical: i === this.display.route.length - 2 ? EdgeConstraints.Horizontal : EdgeConstraints.None
                }

                let ea1:EdgeAnchor = new EdgeAnchor(this.display.id + ":"+ i, {x: pt.x, y:pt.y}, this.params.anchorParams, status, constraints)

                let ea2:EdgeAnchor = new EdgeAnchor(this.display.id + ":"+ ((i-1) + .5), { x:(ptprev.x + pt.x)/2, y: pt.y}, this.params.anchorParams, EdgeAnchorStatus.Free, i === 1 || i === this.display.route.length -1 ? EdgeConstraints.Horizontal | EdgeConstraints.Vertical : EdgeConstraints.Horizontal)

                anchors.push(ea2.render())
                anchors.push(ea1.render())
              } 
            }
     
          p += pt.x + "," + pt.y + " "
          ptprev = pt
          i++
        })

        if(!this.display.isSelected) {
          anchors = [];
        }

        let thetaStart = helpers.getOrthagonalAngle(this.display.route[0], this.display.route[1])
        start = getStartDecoration(this.display.id, this.display.edgeData.type, this.display.route[0], this.display.route[1], thetaStart, styles)

        let thetaEnd = helpers.getStraightAngle(this.display.route[this.display.route.length-2], this.display.route[this.display.route.length-1])
        end = getEndDecoration(this.display.id, this.display.edgeData.type, this.display.route[this.display.route.length-1], this.display.route[this.display.route.length-2], thetaEnd, styles)

        let as:JSX.Element[] = []
        
        anchors.sort((a,b) => a.props['id'].localeCompare(b.props['id'])).forEach((at:JSX.Element) => {
          as.push(at)
        })

        return (
          <g key={this.display.id} id={this.display.id}>
   
            <polyline id={this.display.id + ":bg"} className="edge-ptr" points={p} data-edge-id={this.display.edgeData.edgeId} data-element='connector' fill="none" strokeWidth="10" strokeOpacity="0.1" strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} onMouseDown={this.edgeClick} onMouseEnter={this.edgeEnter} onMouseLeave={this.edgeLeave} onMouseUp={this.edgeUp}/>
            
            <polyline id={this.display.id + ":edge"} className='edge display-edge' points={p} data-edge-id={this.display.edgeData.edgeId} data-element='connector' fill="none" width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor}  />
            { start }
            { end }
            { as }
          </g>
        )
        break
      case EdgeLayout.Rounded:
        i = 0
        
        this.display.route.forEach((pt:Position) => {
          if(this.display.isSelected && (i >= 0) && (i < this.display.route.length)) {
            if(i === 0) {
              let ea0:EdgeAnchor = new EdgeAnchor(this.display.id + ":0", {x: pt.x, y:pt.y}, this.params.anchorParams, EdgeAnchorStatus.Locked, EdgeConstraints.EndAnchor | EdgeConstraints.None)
              anchors.push(ea0.render())
            } else {
              let status = EdgeAnchorStatus.Free
              let constraints:EdgeConstraints|undefined = undefined
              if(i === this.display.route.length -1) {
                status = EdgeAnchorStatus.Locked
                constraints = EdgeConstraints.EndAnchor
              }
              if(i === this.display.route.length -1) {status = EdgeAnchorStatus.Locked}
              
              if(ptprev.x === pt.x ) {
                if(constraints!=undefined) {
                  constraints =  constraints | (i === 1 ? EdgeConstraints.Horizontal: i === this.display.route.length - 2 ? EdgeConstraints.Vertical : EdgeConstraints.None)
                } else {
                  constraints =  i === 1 ? EdgeConstraints.Horizontal: i === this.display.route.length - 2 ? EdgeConstraints.Vertical : EdgeConstraints.None
                }

                let ea1:EdgeAnchor = new EdgeAnchor(this.display.id + ":"+ i, {x: pt.x, y:pt.y}, this.params.anchorParams, status, 
                constraints)

                let ea2:EdgeAnchor = new EdgeAnchor(this.display.id + ":"+ ((i-1) + .5), {x: pt.x, y:(ptprev.y + pt.y)/2}, this.params.anchorParams, EdgeAnchorStatus.Free, i === 1 || i === this.display.route.length -1 ? EdgeConstraints.Horizontal | EdgeConstraints.Vertical : EdgeConstraints.Vertical)

                anchors.push(ea2.render())
                anchors.push(ea1.render())
              } else if(ptprev.x != pt.x ) {  
                if(constraints!=undefined) {
                  constraints =  constraints | (i === 1  ? EdgeConstraints.Vertical: i === this.display.route.length - 2 ? EdgeConstraints.Horizontal : EdgeConstraints.None)
                } else {
                  constraints =   i === 1  ? EdgeConstraints.Vertical: i === this.display.route.length - 2 ? EdgeConstraints.Horizontal : EdgeConstraints.None
                }
                let ea1:EdgeAnchor = new EdgeAnchor(this.display.id + ":"+ i, {x: pt.x, y:pt.y}, this.params.anchorParams, status, 
                  i === 1  ? EdgeConstraints.Vertical: i === this.display.route.length - 2 ? EdgeConstraints.Horizontal : EdgeConstraints.None)

                let ea2:EdgeAnchor = new EdgeAnchor(this.display.id + ":"+ ((i-1) + .5), { x:(ptprev.x + pt.x)/2, y: pt.y}, this.params.anchorParams, EdgeAnchorStatus.Free, i === 1 || i === this.display.route.length -1 ? EdgeConstraints.Horizontal | EdgeConstraints.Vertical : EdgeConstraints.Horizontal)

                anchors.push(ea2.render())
                anchors.push(ea1.render())
              } 
            }
          }

          if(i === 0) {
            p = "M " + pt.x + "," + pt.y + " " 
          }
          else if( i < this.display.route.length - 1) {
            let angle1 = helpers.getOrthagonalAngle(ptprev, pt)
            let angle2 = helpers.getOrthagonalAngle(pt, this.display.route[i+1])
            switch(angle1) {
              case EdgeDirection.Right:
                p += " L " + (pt.x - 10) + "," + pt.y + " " 
                if(angle2 === EdgeDirection.Down) {
                  p += "a10,10 5 0,1 10,10 "
                } else if(angle2 === EdgeDirection.Up) {
                  p+= "a10,10 5 0,0 10,-10 "
                }
                break
              case EdgeDirection.Down:
                p += " L " + pt.x + "," + (pt.y - 10) + " "
                if(angle2 === EdgeDirection.Right) {
                  p += "a10,10 5 0,0 10,10 "
                } else if(angle2 === EdgeDirection.Left) {
                  p += "a10,10 5 0,1 -10,10"
                }
                break
              case EdgeDirection.Left:
                p += " L " + (pt.x + 10) + "," + pt.y + " " 
                if(angle2 === EdgeDirection.Down) {
                  p += "a10,10 5 0,0 -10,10"
                } else if(angle2 === EdgeDirection.Up) {
                  p += "a10,10 5 0,1 -10,-10"
                }
                break
              case EdgeDirection.Up:
                p += " L " + pt.x + "," + (pt.y + 10) + " "
                if(angle2 === EdgeDirection.Right) {
                  p +=  "a10,10 90 0,1 10,-10 "
                } else if(angle2 === EdgeDirection.Left) {
                  p+= "a10,10 90 0,0 -10,-10 "
                }
                break
            }
          } else {
            p +=  " L " + pt.x + "," +pt.y + " "
          }
          ptprev = pt
          i++
        })

        if(!this.display.isSelected) {
          anchors = [];
        }

        let theta2Start = helpers.getOrthagonalAngle(this.display.route[0], this.display.route[1])
        start = getStartDecoration(this.display.id, this.display.edgeData.type, this.display.route[0], this.display.route[1], theta2Start, styles)

        let theta2End = helpers.getStraightAngle(this.display.route[this.display.route.length-2], this.display.route[this.display.route.length-1])
        end = getEndDecoration(this.display.id, this.display.edgeData.type, this.display.route[this.display.route.length-1], this.display.route[this.display.route.length-2], theta2End, styles)

        return (
          <g key={this.display.id} id={this.display.id}>
            <path id={this.display.id + ":bg"} className="edge-ptr" d={p} data-edge-id={this.display.edgeData.edgeId} data-element='connector' fill="none" strokeWidth="10" strokeOpacity="0.1" stroke={styles.strokeColor} onClick={this.edgeClick} onMouseEnter={this.edgeEnter} onMouseLeave={this.edgeLeave} onMouseUp={this.edgeUp}/>
            <path id={this.display.id + ":edge"}  className='edge display-edge' d={p} data-edge-id={this.display.edgeData.edgeId} data-element='connector' fill="none" strokeWidth={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} />
            { start }
            { end }
            { anchors }
          </g>
        )
        break
      case EdgeLayout.Bezier:
        let theta3Start = helpers.getStraightAngle(this.display.route[0], this.display.route[1])
        start = getStartDecoration(this.display.id, this.display.edgeData.type, this.display.route[0], this.display.route[1], theta3Start, styles)

        let theta3End = helpers.getStraightAngle(this.display.route[this.display.route.length-2], this.display.route[this.display.route.length-1])
        end = getEndDecoration(this.display.id, this.display.edgeData.type, this.display.route[this.display.route.length-1], this.display.route[this.display.route.length-2], theta3End, styles)

        p = "M " + (this.display.route[0].x) + "," + (this.display.route[0].y) + " "
        p+= "C " + (this.display.route[1].x) + "," + (this.display.route[1].y) + " " + (this.display.route[2].x) + "," + (this.display.route[2].y) + " "  + (this.display.route[3].x) + "," + (this.display.route[3].y) + " "
        p+= "S " + (this.display.route[4].x) + "," + (this.display.route[4].y )+ " " + (this.display.route[5].x) + "," + (this.display.route[5].y)

        // M EP1       C HP1       HP2       EP1       S HP3       EP2 
        // M 1340,1100 C 1340,1200 1240,1230 1270,1200 S 1100,1250 1140,1300 
        // 0 1         2 3         4         5         6 7         8
        //   0           1         2         3           4         5
        anchors.push(new EdgeAnchor(this.display.id + ":S", this.display.route[0], this.params.anchorParams, EdgeAnchorStatus.Locked, (EdgeConstraints.None | EdgeConstraints.EndAnchor)).render())
        anchors.push(new EdgeAnchor(this.display.id + ":M"+ i, this.display.route[3], this.params.anchorParams, EdgeAnchorStatus.Free, EdgeConstraints.None).render())
        anchors.push(new EdgeAnchor(this.display.id + ":E"+ i, this.display.route[5], this.params.anchorParams, EdgeAnchorStatus.Locked, (EdgeConstraints.None | EdgeConstraints.EndAnchor)).render())
           
        let HC2I:Position = helpers.getInverse(this.display.route[2], this.display.route[3])

        handles.push(new EdgeHandle(this.display.id + ":HC1", (this.display.route[1]), (this.display.route[0]), this.params.handleParams, EdgeAnchorStatus.Free, EdgeConstraints.None).render())
        handles.push(new EdgeHandle(this.display.id + ":HC2", (this.display.route[2]), (this.display.route[3]), this.params.handleParams, EdgeAnchorStatus.Free, EdgeConstraints.None).render())
        handles.push(new EdgeHandle(this.display.id + ":HC2I", HC2I, (this.display.route[3]), this.params.handleParams, EdgeAnchorStatus.Free, EdgeConstraints.None).render())
        handles.push(new EdgeHandle(this.display.id + ":HC3", (this.display.route[4]), (this.display.route[5]), this.params.handleParams, EdgeAnchorStatus.Free, EdgeConstraints.None).render())
        
        if(!this.display.isSelected) {
          anchors = [];
          handles=[]
        }

        return (
          <g key={this.display.id} id={this.display.id} >
            <path id={this.display.id + ":bg"} className="edge-ptr" d={p} data-edge-id={this.display.edgeData.edgeId} data-element='connector' fill="none" strokeWidth="10"  strokeOpacity="0.1" stroke={styles.strokeColor} onClick={this.edgeClick} onMouseEnter={this.edgeEnter} onMouseLeave={this.edgeLeave} onMouseUp={this.edgeUp}/>
            <path id={this.display.id + ":edge"}  className='edge display-edge' d={p} data-edge-id={this.display.edgeData.edgeId} data-element='connector'  fill="none" strokeWidth={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} />
            { start }
            { end }
            { handles }
            { anchors }
          </g>
        )
        break
    }
  }
}