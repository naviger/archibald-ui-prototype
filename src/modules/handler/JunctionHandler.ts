import { AnchorStatus } from "../enums/enumAnchorStatus"
import { CanvasMode } from "../enums/enumCanvasMode"
import { EdgeLayout } from "../enums/enumEdgeLayout"
import { FlowDirection } from "../enums/enumFlowDirection"
import { EdgeDisplayInstance } from "../structure/Edge"
import { JunctionDisplayInstance } from "../structure/Junction"
import { JunctionAnchorData } from "../structure/JunctionAnchorData"
import { NodeDisplayInstance } from "../structure/Node"
import { Position } from "../structure/Position"
import Helpers from "../utilities/Helpers"
import { CanvasController } from "./CanvasController"

export class JunctionHandler {

  canvasController:CanvasController
  helpers = new Helpers()

  constructor(canvasController:CanvasController) {
    this.canvasController = canvasController
  }

  setHover = (id: string) => {
    let ja = this.canvasController.junctions.map((j) => {
      if (j.id === id) { 
        j.showAnchors = true
      } 
      return j
    })
    this.canvasController.setJunctions(ja)
  }

  clearHover = (id: string) => {
    let ja = this.canvasController.junctions.map((j) => {
      j.showAnchors = false
      return j
    })
    this.canvasController.setJunctions(ja)
  }

  setSelected = (id:string, pos:Position, offset:Position) => {
    const el = document.getElementById(id)
    this.canvasController.setDragData({type:"junction", currentId:id, offset: offset, position: pos})
    this.canvasController.setMode(CanvasMode.MoveJunction)
    this.canvasController.setSelected("junction:" + id)
  }


  move = (pos:Position) => {
    if( this.canvasController.mode === CanvasMode.MoveJunction) {
      
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

      let ja:Array<JunctionDisplayInstance> = this.canvasController.junctions.map((j, i)=>{
        if(j.id === this.canvasController.dragData.currentId) {
          j.position.x = pos.x - this.canvasController.dragData.offset.x
          j.position.y = pos.y - (this.canvasController.dragData.offset.y)

          for(let i=0; i < j.anchors.length; i++) {
            if(j.anchors[i].edges.length > 0) {
              j.anchors[i].edges.forEach((et: string)=> {
                let e:EdgeDisplayInstance | undefined = ea.find((er) => { return er.id === et})
                if(e) {
                  e.route = this.helpers.getAdjustedRoute(this.canvasController.nodes, this.canvasController.junctions, e, j.id)
                }
              })
            }
          }
        } 
        return j
      })
      this.canvasController.setJunctions(ja)
      this.canvasController.setEdges(ea)
    } 
  }

  drop = () => {
    this.canvasController.setDragData({type:"none", currentId:'', offset: { x: -1, y: -1}, position: { x: -1, y: -1}})
    this.canvasController.setMode(CanvasMode.Ready)
  }

  startNewEdge = (id:string, key:boolean) => {
    const el = document.getElementById(id)
    const jid= id.split(":")[0]
    const aid = id.split(":")[1]
    if(key) {
      let jj:JunctionDisplayInstance = this.canvasController.junctions.find((jd)=> { return jd.id === jid}) as JunctionDisplayInstance
      let aa:JunctionAnchorData = jj.anchors.find((an) => {return an.id === aid} ) as JunctionAnchorData
      if(aa.status === AnchorStatus.Open || (aa.status === AnchorStatus.Available && aa.flow === FlowDirection.Out)) {
        el?.setAttribute("stroke-width", "3")
        el?.setAttribute("stroke", "green")
        let ned = this.canvasController.newEdge
        ned.edgeData.sourceObject = jid
        ned.sourceAnchor=aid
        ned.route=[{x:jj.position.x + aa.position.x , y:jj.position.y + aa.position.y}, {x:jj.position.x + aa.position.x, y:jj.position.y + aa.position.y}]
        this.canvasController.setMode(CanvasMode.AddEdge)
        this.canvasController.setNewEdge(ned)
      }
    }
  }

  endNewEdge = (id:String) => {
    
    if(this.canvasController.mode === CanvasMode.AddEdge) {
      let ed:EdgeDisplayInstance = structuredClone(this.canvasController.newEdge);
      let hed:EdgeDisplayInstance = structuredClone(this.canvasController.newEdge);
      let jid = id.split(":")[0]
      let aid = id.split(":")[1]
      let dn = this.canvasController.junctions.find((j) => { return j.id === jid}) as JunctionDisplayInstance
      let an = dn?.anchors.find((a) => { return a.id === aid}) as JunctionAnchorData
      ed.edgeData.destinationObject = jid
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
        this.canvasController.setJunctions(ja)
        if(na.length > 0) this.canvasController.setNodes(na)
        hed.route = [{x:-1, y:-1}, {x:-1, y:-1}]
        this.canvasController.setNewEdge(hed)
        this.canvasController.setEdges(ea)
      }
      this.canvasController.setMode(CanvasMode.Ready)
    }
  }
}