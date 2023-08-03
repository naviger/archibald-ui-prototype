import { AnchorStatus } from "../enums/enumAnchorStatus"
import { CanvasMode } from "../enums/enumCanvasMode"
import { EdgeLayout } from "../enums/enumEdgeLayout"
import { NodeStatus } from "../enums/enumNodeStatus"
import { EdgeDisplayInstance } from "../structure/Edge"
import { JunctionDisplayInstance } from "../structure/Junction"
import { NodeDisplayInstance } from "../structure/Node"
import { NodeAnchorData } from "../structure/NodeAnchorData"
import { Position } from "../structure/Position"
import Helpers from "../utilities/Helpers"
import { CanvasController } from "./CanvasController"
import { JunctionAnchorData } from "../structure/JunctionAnchorData"
import { FlowDirection } from "../enums/enumFlowDirection"

export class NodeHandler {
  canvasController:CanvasController
  helpers = new Helpers()
  
  constructor(canvasController:CanvasController) {
    this.canvasController= canvasController
  }

  setHover = (id:string) => {
    const el = document.getElementById(id)
    el?.setAttribute("stroke-width", "2")
    el?.setAttribute("stroke", "grey")

    const elN = document.getElementById(el?.getAttribute("data-node-id") as string)
    elN?.setAttribute("data-hover", "true")
    if(this.canvasController.mode === CanvasMode.AddEdge) {
      let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
        if(n.id === id) {
          n.isSelected=true
          n.status = NodeStatus.Ready;
        }
        return n;
      })
      this.canvasController.setNodes(na)
    }
  }
  
  clearHover =  (id:string) => {
    const el = document.getElementById(id)
    el?.setAttribute("stroke-width", "1")
    el?.setAttribute("stroke", "grey")

    const elN = document.getElementById(el?.getAttribute("data-node-id") as string)
    elN?.setAttribute("data-hover", "false")
  }

  setReady = (id:string) => {
    const el = document.getElementById(id)
    el?.setAttribute("stroke-width", "1")
    el?.setAttribute("stroke", "green")
    let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
      if(n.nodeData.nodeId==id) {
         n.isSelected=true
        n.status = NodeStatus.Ready;
      }
      return n;
    })
    this.canvasController.setNodes(na)
  }
  
  setSelected = (id:string) => {
    const el = document.getElementById(id)
    el?.setAttribute("stroke-width", "1")
    el?.setAttribute("stroke", "green")
    let nid:string = el?.getAttribute("data-node-id") as string
    let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
      if(n.nodeData.nodeId === nid) {
        n.isSelected=true
      }
      return n;
    })
    this.canvasController.setNodes(na)
    this.canvasController.setSelected("node:" + id)
  }
  
  startMove = (id:string, key:boolean, pos:Position) => {
    const el = document.getElementById(id)
    const bbox = el?.getBoundingClientRect() as DOMRect;
    if(!key && this.canvasController.mode === CanvasMode.Ready){
      this.canvasController.select("node", id, {x: pos.x - bbox.left, y:pos.y- bbox.top}, pos)
      let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
        if(n.id === id) {
          n.status = NodeStatus.Moving
        } 
        return n
      })
      this.canvasController.setNodes(na)
      this.canvasController.setMode(CanvasMode.MoveNode)
    } else {
      this.canvasController.clearSelect()
      this.canvasController.setMode(CanvasMode.Ready);
    } 
  }

  inMove = (id:string, key:boolean, pos:Position) => {
    if(this.canvasController.dragData.type==='node' && this.canvasController.dragData.currentId.length > 0){
      const el = document.getElementById(id)
      if(id == this.canvasController.dragData.currentId && !key && this.canvasController.mode === CanvasMode.MoveNode) {
        let ea:Array<EdgeDisplayInstance> = this.canvasController.edges.map((ed) => {
          if(ed.edgeData.sourceObject === this.canvasController.dragData.currentId && ed.style.layout === EdgeLayout.Bezier ) {
            let p:Array<Position> = structuredClone(ed.route)
            const pos2:Position = {x: pos.x- this.canvasController.dragData.offset.x, y: pos.y- (this.canvasController.dragData.offset.y +30)}
            let n:NodeDisplayInstance = this.canvasController.nodes.find((nd) => { return nd.id === ed.edgeData.sourceObject}) as NodeDisplayInstance
            let handleOffset:Position = {x: p[1].x - p[0].x, y: p[1].y - p[0].y} //difference between anchor and handle
            let anchorOffset:Position = {x:p[0].x - (n.position.x), y: p[0].y - (n.position.y)}
            p[0] = {x: pos2.x + anchorOffset.x, y:pos2.y + anchorOffset.y }
            p[1] = {x: pos2.x + anchorOffset.x + handleOffset.x , y: pos2.y + anchorOffset.y + handleOffset.y}
            ed.route = p
          }

          if(ed.edgeData.destinationObject === this.canvasController.dragData.currentId && ed.style.layout === EdgeLayout.Bezier ) {
            let p:Array<Position> = structuredClone(ed.route)
            const pos2:Position = {x: pos.x - this.canvasController.dragData.offset.x, y: pos.y - (this.canvasController.dragData.offset.y +30)}
            let n:NodeDisplayInstance = this.canvasController.nodes.find((nd) => { return nd.id === ed.edgeData.destinationObject}) as NodeDisplayInstance
            let handleOffset:Position = {x: p[4].x - p[5].x, y: p[4].y - p[5].y} //difference between anchor and handle
            let anchorOffset:Position = {x:p[5].x - (n.position.x), y: p[5].y - (n.position.y)}
            p[5] = {x: pos2.x + anchorOffset.x, y:pos2.y + anchorOffset.y }
            p[4] = {x: pos2.x + anchorOffset.x + handleOffset.x , y: pos2.y + anchorOffset.y + handleOffset.y}
            ed.route = p
          }
          return ed
        })

        let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
          if(n.id === id) {
            n.position.x = pos.x - this.canvasController.dragData.offset.x
            n.position.y = pos.y - (this.canvasController.dragData.offset.y +30)

            for(let i=0; i < n.anchors.length; i++) {
              if(n.anchors[i].edges.length > 0) {
                n.anchors[i].edges.forEach((et: string)=> {
                  let e:EdgeDisplayInstance | undefined = this.canvasController.edges.find((er) => { return er.id === et})
                  if(e) {
                    e.route = this.helpers.getAdjustedRoute(this.canvasController.nodes, this.canvasController.junctions, e, n.id)
                  }
                })
              }
            }
          } 
          return n
        })
        this.canvasController.setNodes(na)
        this.canvasController.setEdges(ea)
      } else if(key && this.canvasController.mode === CanvasMode.AddEdge) {
        let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
          if(n.id === id) {
            n.position.x = pos.x - this.canvasController.dragData.offset.x
            n.position.y = pos.y - (this.canvasController.dragData.offset.y +30)
            n.isSelected = true;
          } 
          return n
        })
        this.canvasController.setNodes(na)
      }
    }
  }

  endMove = (id:string) => {
    const el = document.getElementById(id)
    el?.setAttribute("stroke-width", "1")
    el?.setAttribute("stroke", "green")
    const tid = el?.getAttribute("data-node-id")
    let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
      if(n.nodeData.nodeId === tid) {
        n.isSelected=true
        n.status = NodeStatus.Ready;
      }
      return n;
    })
    this.canvasController.setNodes(na)
    this.canvasController.setMode(CanvasMode.Ready)
    this.canvasController.setDragData({type:"none", currentId: "", offset:{x:0, y:0}, position:{x: 0, y: 0}})
  }
    
  inAddAnchor = (id:string) => {
    if(this.canvasController.mode === CanvasMode.Ready) {
      const el = document.getElementById(id)
      const tid = el?.getAttribute("data-node-id")
      el?.setAttribute("stroke-width", "1")
      el?.setAttribute("stroke", "green")
      let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
        if(n.nodeData.nodeId==tid) {
          n.isSelected=true
          n.status = NodeStatus.AddAnchor;
        }
        return n;
      })

      this.canvasController.setNodes(na)
    } 
  }

  addAnchor = (id:string, pos:Position) => {
    if(id) {
      let na:Array<NodeDisplayInstance> = this.canvasController.nodes.map((n, i)=>{
        if(n.id === id) {
          let a:NodeAnchorData = {
            id: 'd' + (n.anchors.length - 7),
            position: {x:pos.x - n.position.x, y: pos.y - n.position.y},
            status: AnchorStatus.Available && AnchorStatus.Dynamic,
            edges:[]
          }
          n.anchors.push(a)
          n.status = NodeStatus.Ready;
        }
        return n;
      })
      this.canvasController.setNodes(na)
    }
  }
}

export class NodeAnchorHandler {
  canvasController:CanvasController
  helpers = new Helpers()
  
  constructor(canvasController:CanvasController) {
    this.canvasController= canvasController
  }
  
  setHover = (id:string, key:boolean) => {
    const el = document.getElementById(id)      
    el?.setAttribute("stroke-width", "3")
    el?.setAttribute("stroke", "orange")
    if(this.canvasController.mode===CanvasMode.AddEdge && key) {
      el?.setAttribute("fill", "green")
    }
  }
  
  clearHover = (id:string, aid:string) => {
    const el = document.getElementById(id)
    el?.setAttribute("stroke-width", "1")
    el?.setAttribute("stroke", "black")
  }

  startNewEdge = (id:string, key:boolean) => {
    const el = document.getElementById(id)
    const nid= id.split(":")[0]
    const aid = id.split(":")[1]
    if(key) {
      let nn:NodeDisplayInstance = this.canvasController.nodes.find((nd)=> { return nd.id === nid}) as NodeDisplayInstance
      let aa:NodeAnchorData = nn.anchors.find((an) => {return an.id === aid} ) as NodeAnchorData
      el?.setAttribute("stroke-width", "3")
      el?.setAttribute("stroke", "green")
      let ned = this.canvasController.newEdge
      ned.edgeData.sourceObject = nid
      ned.sourceAnchor=aid
      ned.route=[{x:nn.position.x + aa.position.x , y:nn.position.y + aa.position.y}, {x:nn.position.x + aa.position.x, y:nn.position.y + aa.position.y}]
      this.canvasController.setMode(CanvasMode.AddEdge)
      this.canvasController.setNewEdge(ned)
    }
  }

  endNewEdge = (id:string) => {
    let ed:EdgeDisplayInstance = structuredClone(this.canvasController.newEdge);
    let hed:EdgeDisplayInstance = structuredClone(this.canvasController.newEdge);
    if(this.canvasController.mode === CanvasMode.AddEdge) {
      let nid = id.split(":")[0]
      let aid = id.split(":")[1]
      let dn = this.helpers.findAnchorableObject(this.canvasController.nodes, this.canvasController.junctions, nid) as NodeDisplayInstance|JunctionDisplayInstance
      let an = dn?.anchors.find((a) => { return a.id === aid}) as NodeAnchorData
      ed.edgeData.destinationObject = nid
      ed.destinationAnchor = aid
      ed.id = crypto.randomUUID()
      ed.edgeData.name = "New Edge " + ed.edgeData.sourceObject + ":" + ed.sourceAnchor + " ==> " + ed.edgeData.destinationObject + ":" + ed.destinationAnchor
      ed.isSelected=true
      ed.isVisible=true
      ed.style=this.canvasController.defaults.edgeStyle
      ed.edgeData.edgeId = crypto.randomUUID();
      
      let ea:Array<EdgeDisplayInstance> = this.canvasController.edges.map((e, i)=>{
        return e
      })
      ed.route = this.helpers.getAdjustedRoute(this.canvasController.nodes, this.canvasController.junctions, ed, nid)
      ea.push(ed)

      let foundSrc:boolean = false
      let foundDst:boolean = false
      
      let ja:Array<JunctionDisplayInstance> = this.canvasController.junctions.map((j, i)=>{
        
        if(j.id === ed.edgeData.sourceObject) {
          for(let i:number = 0; i < j.anchors.length; i++) {
            if(j.anchors[i].id === ed.sourceAnchor) {
              let ja:JunctionAnchorData = j.anchors[i] as JunctionAnchorData
              if(!ja.edges.includes("ed.id") && (ja.status === AnchorStatus.Open || (ja.status === AnchorStatus.Available && ja.flow === FlowDirection.Out))) {
                ja.flow = FlowDirection.Out
                j.anchors[i].edges.push(ed.id)
                j.anchors[i].status = AnchorStatus.Available
                foundSrc = true;
              }
            }
          }
        }
          
        if(j.id === ed.edgeData.destinationObject) {
          for(let i:number = 0; i < j.anchors.length; i++) {
            if(j.anchors[i].id === ed.destinationAnchor) {
              let ja:JunctionAnchorData = j.anchors[i] as JunctionAnchorData
              if(!ja.edges.includes("ed.id") && (ja.status === AnchorStatus.Open || (ja.status === AnchorStatus.Available && ja.flow === FlowDirection.In))) {
                ja.flow = FlowDirection.In
                j.anchors[i].edges.push(ed.id)
                j.anchors[i].status = AnchorStatus.Available
                j.anchors[i].edges.push(ed.id)
                foundDst = true
              }
            }
          }
        }
        return j;
      })

      let na:Array<NodeDisplayInstance> = []
      na = this.canvasController.nodes.map((n, i)=>{
        if(n.id === ed.edgeData.sourceObject) {
          for(let i:number = 0; i < n.anchors.length; i++) {
            if(n.anchors[i].id === ed.sourceAnchor) {
              if(!n.anchors[i].edges.includes("ed.id")) {
                n.anchors[i].edges.push(ed.id)
                foundSrc = true
              }
            }
          }
        }
        if(n.id === ed.edgeData.destinationObject) {
          for(let i:number = 0; i < n.anchors.length; i++) {
            if(n.anchors[i].id === ed.destinationAnchor) {
              if(!n.anchors[i].edges.includes("ed.id")) {
                n.anchors[i].edges.push(ed.id)
                foundDst = true
              }
            }
          }
        }
        return n;
      })
      
      if(foundSrc && foundDst) {
        this.canvasController.setNodes(na)
        this.canvasController.setJunctions(ja)
        hed.route = [{x:-1, y:-1}, {x:-1, y:-1}]
        this.canvasController.setNewEdge(hed)
        this.canvasController.setEdges(ea)
      }
      this.canvasController.setMode(CanvasMode.Ready)
    }
  }

  dragNewEdge = () => {
  }
}
