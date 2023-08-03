import { CanvasMode } from "../enums/enumCanvasMode";
import { EdgeConstraints } from "../enums/enumEdgeConstraints";
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
      if (ed.style) {
        tgt.setAttribute("stroke-width", ed.style.weight);
        tgt.setAttribute("stroke", ed.style.color);
      }
    }
  }

  setSelectedEdge = (id:string, key:boolean, pos:Position) => {
    
    const eid = id.split(":")[0]

    let ea: Array<EdgeDisplayInstance> = this.canvasController.edges.map((e, i) => {
      if (e.id === eid) {
        e.isSelected = true
      } else {
        e.isSelected = false
      }
      return e
    });

    this.canvasController.setSelected("edge:" + id)
    let nodeEls = document.getElementsByClassName("node");
    for (let i: number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.add("no-pointer-events"); }
    
    this.canvasController.setEdges(ea);
  }

  dragDone = () => {
    if(this.canvasController.mode === CanvasMode.MoveEdgeAnchor) {
        this.canvasController.setDragData({type:'none', currentId:'', offset:{x:-1, y:-1}, position:{x:-1, y: -1}})
    }
  }

  addEdge = (pos:Position, bbox:DOMRect) => {
    let ed:EdgeDisplayInstance = this.canvasController.newEdge
    ed.route[1] = {x:pos.x- bbox.left, y:pos.y-bbox.top}
      
    let el = document.getElementById('temp')
    if(el) {
        let sn:NodeDisplayInstance|JunctionDisplayInstance = this.helpers.findAnchorableObject(this.canvasController.nodes, this.canvasController.junctions, this.canvasController.newEdge.edgeData.sourceObject) as NodeDisplayInstance|JunctionDisplayInstance
        let sa:NodeAnchorData = sn.anchors.find((a) => { return a.id === this.canvasController.newEdge.sourceAnchor}) as NodeAnchorData
        let p:string = (sn.position.x + sa.position.x) + "," + (sn.position.y + sa.position.y) + " " + (ed.route[1].x) +"," + (ed.route[1].y)
        el.setAttribute("points", p)
      }
      this.canvasController.setNewEdge(ed);
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
    this.canvasController.setMode(CanvasMode.MoveEdgeAnchor)
    this.canvasController.setDragData({ type: 'edgeAnchor', currentId: id, offset: { x: pos.x - bbox?.left, y: pos.y - bbox.top }, position: pos })
  }

  moveAnchor = (pos:Position, bbox:DOMRect) => {
    let ea:Array<EdgeDisplayInstance> = this.canvasController.edges.map((ed:EdgeDisplayInstance) => { 
      if(ed.id === this.canvasController.dragData.currentId.split(":")[0] ) { 
        let i:number = 1
        let p:Array<Position> = structuredClone(ed.route)
          
        if(this.canvasController.dragData.currentId.endsWith(":M0")) {
          let ep:Element|null = document.getElementById(this.canvasController.dragData.currentId)  
          let hp:Element|null = document.getElementById(this.canvasController.dragData.currentId.split(":")[0] + ":HC2:C")  
          let offset:Position = { x: (Number.parseInt(ep?.getAttribute("x") as string) - Number.parseInt(hp?.getAttribute("cx") as string)),
                                   y: (Number.parseInt(ep?.getAttribute("y") as string) - Number.parseInt(hp?.getAttribute("cy") as string))}
          p[2] = {x:  pos.x - bbox.left - offset.x , y: pos.y - bbox.top - offset.y}
          p[3] = { x: pos.x - bbox.left, y:  pos.y - bbox.top}

          ed.route = p

        } else {
          const target:number = Number.parseInt(this.canvasController.dragData.currentId.split(":")[1].split(".")[0])
          const a:HTMLElement = document.getElementById(this.canvasController.dragData.currentId) as HTMLElement
          const constraint:Number = Number.parseInt(a.getAttribute("data-constraint") as string)
          
          ed.route.forEach((el) => {  // <<<<<<<<<<<<<<<< iterate through route of the edge
            let pt:Position = structuredClone(ed.route[i])
            
            if(constraint === EdgeConstraints.Vertical || constraint === EdgeConstraints.None) {
              if(i === target - 1 && ed.route[i].x === ed.route[target].x) {
                pt.x =  pos.x - bbox.left
              }
              if(i === target) {
                pt.x =  pos.x - bbox.left
              }
              if(i === target + 1  && ed.route[i].x === ed.route[target].x ) {
                pt.x = pos.x - bbox.left
              }
            }

            if(constraint === EdgeConstraints.Horizontal || constraint === EdgeConstraints.None) {
              if(i === target - 1 && ed.route[i].y === ed.route[target].y) {
                pt.y =  pos.y - bbox.top
              }
              if(i === target) {
                pt.y =  pos.y - bbox.top
              }
              if(i === target + 1  && ed.route[i].y === ed.route[target].y ) {
                pt.y =  pos.y - bbox.top
              }
            }
          
            if(pt) {
              p[i] = (pt)
            }
            i++ 
          })
        }

        ed.route = p
             
      }
      return ed; 
    })
    
    this.canvasController.setEdges(ea)
  }

  dropAnchor = (id:string) => { 
    this.canvasController.setDragData({ type: 'none', currentId: '', offset: { x: -1, y: -1 }, position: { x: -1, y: -1 } })
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
      this.canvasController.setMode(CanvasMode.MoveEdgeHandle)
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
      let ed = document.getElementById(eid)
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
      const eid = id.split(":")[0]
      const hid = id.split(":")[1]

      if (eid && hid) {
        let ed: EdgeDisplayInstance = this.canvasController.edges.find((t) => { return t.id === eid; }) as EdgeDisplayInstance
      }
    }
  }

  endMoveHandle = () => {
    this.canvasController.setMode(CanvasMode.Ready)
    this.canvasController.setDragData({ type: 'none', currentId: '', offset: { x: -1, y: -1 }, position: { x: -1, y: -1 } })
  }
}