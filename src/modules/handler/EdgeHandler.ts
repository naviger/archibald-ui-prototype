import { CanvasMode } from "../enums/enumCanvasMode";
import { EdgeConstraints } from "../enums/enumEdgeConstraints";
import { EdgeDirection } from "../enums/enumEdgeDirection";
import { EdgeLayout } from "../enums/enumEdgeLayout";
import { HistoryActionType } from "../enums/enumHistoryType";
import { EdgeDisplayInstance } from "../structure/Edge";
import { JunctionDisplayInstance } from "../structure/Junction";
import { NodeDisplayInstance } from "../structure/Node";
import { NodeAnchorData } from "../structure/NodeAnchorData";
import { Position } from "../structure/Position";
import Helpers from "../utilities/Helpers";
import { CanvasController } from "./CanvasController";
import { EdgePropertyBoxHandler } from "./EdgePropertyBoxHandler";

export class EdgeHandler {
  canvasController:CanvasController
  edgePropertyBoxHandler:EdgePropertyBoxHandler
  helpers:Helpers = new Helpers()

  constructor(canvasController:CanvasController) {
    this.canvasController = canvasController
    this.edgePropertyBoxHandler = new EdgePropertyBoxHandler(canvasController)
    this.helpers = new Helpers()
  }

  setHover = (id:string) => {
    const eid = id.split(":")[0];
    const tgt = document.getElementById(eid as string) as Element
    tgt.setAttribute("stroke-width", "3");
    tgt.setAttribute("stroke", "teal");
  }

  clearHover = (id:string) => {
    if (this.canvasController.mode != CanvasMode.AddEdge) {
      const eid = id.split(":")[0];
      const tgt = document.getElementById(eid) as Element;
      let ed: EdgeDisplayInstance = this.canvasController.edges.find((t) => { return t.id === eid; }) as EdgeDisplayInstance;
      if (ed && ed.style) {
        tgt.setAttribute("stroke-width", ed.style.weight);
        tgt.setAttribute("stroke", ed.style.color);
      }
    }
  }

  setSelectedEdge = (id:string, key:boolean, pos:Position) => {
    const eid = id.split(":")[0]
    this.canvasController.setSelectedItem("edge", id)
    let ea: Array<EdgeDisplayInstance> = this.canvasController.edges.map((e, i) => {
      if (e.id === eid) {
        e.isSelected = true
      } else {
        e.isSelected = false
      }
      return e
    });

    let nodeEls = document.getElementsByClassName("node");
    this.canvasController.setEdges(ea);
  }

  dragDone = () => {
    switch(this.canvasController.mode) {
      case CanvasMode.MoveEdgeAnchor:
        this.canvasController.setDragData({type:'none', currentId:'', offset:{x:-1, y:-1}, position:{x:-1, y: -1}})
        break
      case CanvasMode.MoveEdgeEndAnchor:
        this.canvasController.setCanvasMode(CanvasMode.Ready)
    }
  }

  moveAddEdge = (pos:Position, bbox:DOMRect) => {
    let ed:EdgeDisplayInstance = this.canvasController.newEdge
    ed.route[1] = {x:pos.x- bbox.left, y:pos.y-bbox.top}
      
    let el = document.getElementById('temp-edge:edge')
    if(el) {
        let sn:NodeDisplayInstance|JunctionDisplayInstance = this.helpers.findAnchorableObject(this.canvasController.nodes, this.canvasController.junctions, this.canvasController.newEdge.edgeData.sourceObject) as NodeDisplayInstance|JunctionDisplayInstance
        let sa:NodeAnchorData = sn.anchors.find((a) => { return a.id === this.canvasController.newEdge.sourceAnchor}) as NodeAnchorData
        let p:string = (sn.position.x + sa.position.x) + "," + (sn.position.y + sa.position.y) + " " + (ed.route[1].x) +"," + (ed.route[1].y)
        el.setAttribute("points", p)
      }
      this.canvasController.setNewEdge(ed);
  }

  moveEdgeEndPoint = (pos:Position, bbox:DOMRect) => {
    if(this.canvasController.mode & CanvasMode.MoveEdgeEndAnchor) {
      let ie = this.canvasController.edges.findIndex((e) => e.id === this.canvasController.dragData.currentId.split(":")[0])
      if(ie >= 0) {
        let el = document.getElementById('temp-edge:edge')
        let ia = Number.parseInt(this.canvasController.dragData.currentId.split(":")[1])
        let r:Array<Position> = structuredClone(this.canvasController.edges[ie].route)
        let l = this.canvasController.edges[ie].route.length
        let p:string = ""
        if(this.canvasController.edges[ie].style.layout === EdgeLayout.Straight) {
          r[ia] =  { x: pos.x - bbox.left, y:  pos.y - bbox.top}
          p =  (r[0].x) +"," + (r[0].y) + " " + (r[1].x) +"," + (r[1].y)
        } else if(this.canvasController.edges[ie].style.layout === EdgeLayout.Bezier) {
          if(this.canvasController.dragData.currentId.split(":")[1] === "S") {
            r[0] =  { x: pos.x - bbox.left, y:  pos.y - bbox.top}
          } else {
            r[5] = { x: pos.x - bbox.left, y:  pos.y - bbox.top}
          }
          
          p = "M " + (r[0].x) + "," + (r[0].y) + " "
          p+= "C " + (r[1].x) + "," + (r[1].y) + " " + (r[2].x) + "," + (r[2].y) + " "  + (r[3].x) + "," + (r[3].y) + " "
          p+= "S " + (r[4].x) + "," + (r[4].y )+ " " + (r[5].x) + "," + (r[5].y)

          el?.setAttribute("d", p)
        } else if(this.canvasController.edges[ie].style.layout === EdgeLayout.Rounded) {
          let r2:Position[] = structuredClone(r)
          for(let i:number = 0; i < r.length; i++) {
            if(i === ia) {
              r2[ia]= {x: (pos.x - bbox.left), y:(pos.y - bbox.top)}
            } else if(i === ia + 1 ) {
              if(r[i].x === r[i + 1].x) {
                r2[i].y =(pos.y - bbox.top)
              } else {
                r2[i].x = (pos.x - bbox.left)
              }
            } else if(i === ia - 1 ) {
              if(r[i].x === r[i - 1].x) {
                r2[i].y =(pos.y - bbox.top)
              } else {
                r2[i].x = (pos.x - bbox.left)
              }
            }
          }

          let ptprev:Position = r[0]
          r2.forEach((pt:Position, i:number) => {
            if(i === 0) {
              p = "M " + pt.x + "," + pt.y + " " 
            }
            else if( i < r.length-1) {
              let angle1 = this.helpers.getStraightAngle(ptprev, pt)
              let angle2 = this.helpers.getStraightAngle(pt, r2[i+1])
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
              p +=  "L " + pt.x + "," +pt.y + " "
            }
            ptprev = pt
          })
          el?.setAttribute("d", p)
        } else  if(this.canvasController.edges[ie].style.layout === EdgeLayout.NinetyDegree) {
          for(let i:number = 0; i < r.length; i++) {
            if(i === ia) {
              p += "" + (pos.x - bbox.left).toString() + "," + (pos.y - bbox.top).toString() + " "
            } else if(i === ia + 1 ) {
              if(r[i].x === r[i + 1].x) {
                p +=  r[i].x + ", " + (pos.y - bbox.top).toString() + " "
              } else {
                p +=  (pos.x - bbox.left).toString() + "," + r[i].y + " "
              }
            } else if(i === ia - 1 ) {
              if(r[i].x === r[i - 1].x) {
                p +=  r[i].x + ", " + (pos.y - bbox.top).toString() + " "
              } else {
                p +=  (pos.x - bbox.left).toString() + "," + r[i].y + " "
              }
            }
            else {
              p += r[i].x + "," + r[i].y + " "
            }
          }

          el?.setAttribute("points", p)
        }
      }
    }
  }

  remove = (id:string) => {
    let correlation:string = crypto.randomUUID()
    let tgt:number = this.canvasController.edges.findIndex((e)=>{return e.id === id})
    let ea = structuredClone(this.canvasController.edges)
    ea.splice(tgt, 1)
    this.canvasController.setEdges(ea)
    this.canvasController.addHistoryItem(correlation, HistoryActionType.Delete, "EdgeDisplayInstance", "The edge display instance "+ id + " was deleted.", ea[tgt])
    this.canvasController.saveHistory()
  }
}

export class EdgeAnchorHandler {
  canvasController:CanvasController

  constructor(canvasController:CanvasController) {
    this.canvasController = canvasController
  }

  selectAnchor = (id:string, pos:Position) => {
    const el = document.getElementById(id)  
    const bbox = el?.getBoundingClientRect() as DOMRect
    const constraint:number = Number.parseInt(el?.getAttribute("data-constraint") as string)

    if(EdgeConstraints.EndAnchor & constraint) {
      let elE = document.getElementById(id.split(":")[0] + ":edge")
      let elT = document.getElementById("temp-edge:edge") as Element
      let elG = elT?.parentElement
      elT?.parentNode?.removeChild(elT)
      elT = elE?.cloneNode() as Element
      elT.id = "temp-edge:edge"
      elG?.append(elT)
      elT = elE?.cloneNode(true) as Element
      let aid:string =  id.split(":")[1]
      elT.setAttribute("data-edge-ref", id.split(":")[0])
      elT.setAttribute("data-anchor-ref", aid) 
      this.canvasController.setCanvasMode(CanvasMode.MoveEdgeEndAnchor, id)
      this.canvasController.setDragData({ type: 'edgeAnchor', currentId: id, offset: { x: pos.x - bbox?.left, y: pos.y - bbox.top }, position: pos })
    } else {
      this.canvasController.setCanvasMode(CanvasMode.MoveEdgeAnchor, id)
      this.canvasController.setDragData({ type: 'edgeAnchor', currentId: id, offset: { x: pos.x - bbox?.left, y: pos.y - bbox.top }, position: pos })
    }
  }

  moveAnchor = (pos:Position, bbox:DOMRect) => {
    let ea:Array<EdgeDisplayInstance> = this.canvasController.edges.map((ed:EdgeDisplayInstance) => { 
      if(ed.id === this.canvasController.dragData.currentId.split(":")[0] ) { 
        let r:Array<Position> = structuredClone(ed.route)
        
        if(this.canvasController.dragData.currentId.endsWith(":M0")) {
          let ep:Element|null = document.getElementById(this.canvasController.dragData.currentId)  
          let hp:Element|null = document.getElementById(this.canvasController.dragData.currentId.split(":")[0] + ":HC2:C")  
          let offset:Position = { x: (Number.parseInt(ep?.getAttribute("x") as string) - Number.parseInt(hp?.getAttribute("cx") as string)),
                                  y: (Number.parseInt(ep?.getAttribute("y") as string) - Number.parseInt(hp?.getAttribute("cy") as string))}
          r[2] = {x:  pos.x - bbox.left - offset.x , y: pos.y - bbox.top - offset.y}
          r[3] = { x: pos.x - bbox.left, y:  pos.y - bbox.top}

          ed.route = r
        
        } else {
          const target:number = Number.parseInt(this.canvasController.dragData.currentId.split(":")[1].split(".")[0])
          const a:HTMLElement = document.getElementById(this.canvasController.dragData.currentId) as HTMLElement
          const constraint:Number = Number.parseInt(a.getAttribute("data-constraint") as string)
          
          ed.route.forEach((el, i) => {  // <<<<<<<<<<<<<<<< iterate through route of the edge
            let pt:Position = structuredClone(ed.route[i])
            if(constraint === EdgeConstraints.Vertical || constraint === EdgeConstraints.None) {
              if(i === target - 1 && ed.route[i].x === ed.route[target].x) {
                pt.x =  pos.x - bbox.left
              }
              if(i === target) {
                pt.x =  pos.x - bbox.left
              }
              if(i === target + 1 && i < ed.route.length && ed.route[i].x === ed.route[target].x ) {
                pt.x = pos.x - bbox.left
              }
            }

            if((constraint === EdgeConstraints.Horizontal) || constraint === EdgeConstraints.None ) {
              if(i === target - 1 && ed.route[i].y === ed.route[target].y) {
                pt.y =  pos.y - bbox.top
              }
              if(i === target) {
                pt.y =  pos.y - bbox.top
              }
              if(i === target + 1 && i < ed.route.length && ed.route[i].y === ed.route[target].y ) {
                pt.y =  pos.y - bbox.top
              }
            }

            if(pt) {
              r[i] = (pt)
            }
          })
        }
        ed.route = r             
      }
      return ed; 
    })
    this.canvasController.setEdges(ea)
  }

  dropAnchor = (id:string) => { 
    switch(this.canvasController.mode) {
      case CanvasMode.MoveEdgeAnchor:
        this.canvasController.setDragData({type:'none', currentId:'', offset:{x:-1, y:-1}, position:{x:-1, y: -1}})
        break
      case CanvasMode.MoveEdgeEndAnchor:
        this.canvasController.setCanvasMode(CanvasMode.Ready)
    }
  }
}

export class EdgeHandleHandler {
  canvasController:CanvasController
  helpers:Helpers

  constructor(canvasController:CanvasController) {
    this.canvasController = canvasController
    this.helpers = new Helpers()
  }

  setSelectedHandle = (id:string, key:boolean, pos:Position) => {
    if (!key ) {
      const el =document.getElementById(id)
      const bbox = el?.getBoundingClientRect() as DOMRect
      this.canvasController.setCanvasMode(CanvasMode.MoveEdgeHandle, id.split(":")[0])
      this.canvasController.select('edgeHandle', id as string,  { x: pos.x - bbox?.left, y: pos.y - bbox.top }, { x: pos.x, y: pos.y })
    }
  }

  moveHandlePosition = (pos:Position, bbox:DOMRect) => {
    const eid = this.canvasController.dragData.currentId.split(":")[0] 
    const hid = this.canvasController.dragData.currentId.split(":")[1]

    const p:Position = {x: pos.x - bbox.left, y: pos.y - bbox.top}
  
    if(eid && hid)  {
      let c = document.getElementById(eid + ":" + hid + ":C")
      let l = document.getElementById(eid + ":" + hid + ":L")
      let ed = document.getElementById(eid + ":edge")
      let edbg = document.getElementById(eid + ":bg")
      c?.setAttribute('cx',  ("" + (pos.x- bbox.left))) 
      c?.setAttribute('cy',  ("" + (pos.y - bbox.top)))    
      l?.setAttribute('x1',  ("" + (pos.x - bbox.left)))
      l?.setAttribute('y1',  ("" + (pos.y - bbox.top))) 

      let ds = ed?.getAttribute('d')
      let d:string[]|undefined = ds?.split(" ") 
      
      if(d!=undefined ) {
        if(hid === 'HC2') {
          let pivot = {x: Number.parseInt(d[5].split(",")[0]), y: Number.parseInt(d[5].split(",")[1])}
          let i:Position = this.helpers.getInverse(p, pivot)
          let c2 = document.getElementById(eid + ":HC2I:C")
          let l2 = document.getElementById(eid + ":HC2I:L")
          c2?.setAttribute('cx',  ("" + i.x))
          c2?.setAttribute('cy',  ("" + i.y))   
          l2?.setAttribute('x1',  ("" + i.x))
          l2?.setAttribute('y1',  ("" + i.y))   
        } else if (hid === 'HC2I') {
          let pivot = {x: Number.parseInt(d[5].split(",")[0]), y: Number.parseInt(d[5].split(",")[1])}
          let i:Position = this.helpers.getInverse(p, pivot)
          let c2 = document.getElementById(eid + ":HC2:C")
          let l2 = document.getElementById(eid + ":HC2:L")
          c2?.setAttribute('cx',  ("" + i.x))
          c2?.setAttribute('cy',  ("" + i.y))   
          l2?.setAttribute('x1',  ("" + i.x))
          l2?.setAttribute('y1',  ("" + i.y))   
        }          
    // M EP1       C HP1       HP2       EP1       S HP3       EP2 
    // M 1340,1100 C 1340,1200 1240,1200 1170,1200 S 1100,1250 1140,1300 
    // 0 1         2 3         4         5         6 7         8
    //   0           1         2         3           4         5     << d ref
      
      switch(hid) {
        case 'HC1':
          ds = "M " + d[1] + " C " + p.x + "," + p.y + " " + d[4] + " " + d[5] + " S " + d[7] + " " + d[8] 
          break
        case 'HC2':
          ds = "M " + d[1] + " C " + d[3] + " " + p.x + "," + p.y + " " + d[5] + " S " + d[7] + " " + d[8]
          break
        case 'HC2I':
          let pivot = {x: Number.parseInt(d[5].split(",")[0]), y: Number.parseInt(d[5].split(",")[1])}
          let i:Position = this.helpers.getInverse(p, pivot)
          ds = "M " + d[1] + " C " + d[3] + " " + i.x + "," + i.y + " " + d[5] + " S " + d[7] + " " + d[8]
          break
        case 'HC3':
          ds = "M "+ d[1] + " C " + d[3] + " " + d[4] + " " + d[5] + " S " + p.x + "," + p.y + " " + d[8]
          break
        }
      }
      ed?.setAttribute("d", ds as string)
      edbg?.setAttribute("d", ds as string)
    }
  }

  moveHandle = (id:string) => {
    if (this.canvasController.mode === CanvasMode.MoveEdgeHandle) {
      const el = document.getElementById(id)
      const eid = id.split(":")[0] + ":edge"
      const hid = id.split(":")[1]

      if (eid && hid) {
        let ed: EdgeDisplayInstance = this.canvasController.edges.find((t) => { return t.id === eid; }) as EdgeDisplayInstance
      }
    }
  }

  endMoveHandle = () => {
    this.canvasController.setCanvasMode(CanvasMode.Ready)
    this.canvasController.setDragData({ type: 'none', currentId: '', offset: { x: -1, y: -1 }, position: { x: -1, y: -1 } })
  }


}