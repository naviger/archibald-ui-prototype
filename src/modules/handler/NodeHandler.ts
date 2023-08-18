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
import { Anchorable } from "../structure/Anchorable"
import { EdgeDirection } from "../enums/enumEdgeDirection"

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
    if(this.canvasController.mode === CanvasMode.AddEdge || this.canvasController.mode === CanvasMode.MoveEdgeEndAnchor) {
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
      this.canvasController.setCanvasMode(CanvasMode.MoveNode, id)
    } else {
      this.canvasController.clearSelect()
      this.canvasController.setCanvasMode(CanvasMode.Ready);
    } 
  }

  move = (pos:Position, bbox:DOMRect) => {
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

  inMove = (id:string, key:boolean, pos:Position) => {
    if(this.canvasController.dragData.type==='node' && this.canvasController.dragData.currentId.length > 0){
      const el = document.getElementById(id)
      if(id == this.canvasController.dragData.currentId && !key && this.canvasController.mode === CanvasMode.MoveNode) {
        let ea:Array<EdgeDisplayInstance> = this.canvasController.edges.map((ed) => {
          if(ed.edgeData.sourceObject === this.canvasController.dragData.currentId && ed.style.layout === EdgeLayout.Bezier ) {
            let p:Array<Position> = structuredClone(ed.route)
            const pos2:Position = {x: pos.x- this.canvasController.dragData.offset.x, y: pos.y- (this.canvasController.dragData.offset.y + 30)}
            let n:NodeDisplayInstance = this.canvasController.nodes.find((nd) => { return nd.id === ed.edgeData.sourceObject}) as NodeDisplayInstance
            let handleOffset:Position = {x: p[1].x - p[0].x, y: p[1].y - p[0].y} //difference between anchor and handle
            let anchorOffset:Position = {x:p[0].x - (n.position.x), y: p[0].y - (n.position.y)}
            p[0] = {x: pos2.x + anchorOffset.x, y:pos2.y + anchorOffset.y }
            p[1] = {x: pos2.x + anchorOffset.x + handleOffset.x , y: pos2.y + anchorOffset.y + handleOffset.y}

            ed.route = p
          } else if(ed.edgeData.destinationObject === this.canvasController.dragData.currentId && ed.style.layout === EdgeLayout.Bezier ) {
            let p:Array<Position> = structuredClone(ed.route)
            const pos2:Position = {x: pos.x - this.canvasController.dragData.offset.x, y: pos.y - (this.canvasController.dragData.offset.y + 30)}
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
            n.position.y = pos.y - (this.canvasController.dragData.offset.y + 30)

            // for(let i=0; i < n.anchors.length; i++) {
            //   if(n.anchors[i].edges.length > 0) {
            //     n.anchors[i].edges.forEach((et: string)=> {
            //       let e:EdgeDisplayInstance | undefined = this.canvasController.edges.find((er) => { return er.id === et})
            //       if(e) {
            //         e.route = this.helpers.getAdjustedRoute(this.canvasController.nodes, this.canvasController.junctions, e, n.id)
                    
            //       }
            //     })
            //   }
            // }
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
    this.canvasController.setCanvasMode(CanvasMode.Ready)
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

  remove = (id:string) => {
    let tgt:number = this.canvasController.nodes.findIndex((e)=>{return e.id === id})
    let na = structuredClone(this.canvasController.nodes)
    na.splice(tgt, 1)
    this.canvasController.setNodes(na)
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
      this.canvasController.setCanvasMode(CanvasMode.AddEdge, id)
      this.canvasController.setNewEdge(ned)
    }
  }

  endNewEdge = (id:string) => {
    let ed:EdgeDisplayInstance = structuredClone(this.canvasController.newEdge)
    let hed:EdgeDisplayInstance = structuredClone(this.canvasController.newEdge)
    if(this.canvasController.mode === CanvasMode.MoveEdgeEndAnchor) {
      let e = structuredClone(this.canvasController.edges.find((e) => {return e.id === this.canvasController.dragData.currentId.split(":")[0]})) as EdgeDisplayInstance
      let el = document.getElementById(this.canvasController.dragData.currentId.split(":")[0] + ":edge")
      el?.setAttribute("stroke-opacity", "1")
      let el2 = document.getElementById("temp-edge:edge")
      el2?.setAttribute("points", "-1,-1 -1,-1")
      let eaid:number = Number.parseInt(this.canvasController.dragData.currentId.split(":")[1])
      let a = structuredClone(this.helpers.findAnchorableObject(this.canvasController.nodes, this.canvasController.junctions, id.split(":")[0]))
      let aa = a?.anchors.find((a:Anchorable) => { return a.id === id.split(":")[1]})
      let oldNObj:string = ""
      let oldNA:string = ""
      
      if(e && a && aa) {
        switch(e.style.layout) {
          case EdgeLayout.Straight:
            if(eaid === 0) {
              oldNObj = e.edgeData.destinationObject
              oldNA = e.destinationAnchor
              e.route[0] = {x: a.position.x + aa.position.x, y: a.position.y + aa.position.y } 
              e.sourceAnchor = aa.id
              e.edgeData.sourceObject = a.id
            } else {
              oldNObj = e.edgeData.sourceObject
              oldNA = e.sourceAnchor
              e.route[1] = {x: a.position.x + aa.position.x, y: a.position.y + aa.position.y }
              e.destinationAnchor = aa.id
              e.edgeData.destinationObject = a.id
            }  
            break
          case EdgeLayout.Bezier:
            let ea:string = this.canvasController.dragData.currentId.split(":")[1]
            if(ea === "S") {
              oldNObj = e.edgeData.destinationObject
              oldNA = e.destinationAnchor
              let dx = e.route[0].x - e.route[1].x
              let dy = e.route[0].y - e.route[1].y
              e.route[0] = {x: a.position.x + aa.position.x, y: a.position.y + aa.position.y } 
              e.route[1] = {x:e.route[0].x - dx, y: e.route[0].y - dy} 
              e.sourceAnchor = aa.id
              e.edgeData.sourceObject = a.id
            } else {
              oldNObj = e.edgeData.sourceObject
              oldNA = e.sourceAnchor
              let dx = e.route[5].x - e.route[4].x
              let dy = e.route[5].y - e.route[4].y
              e.route[5] = {x: a.position.x + aa.position.x, y: a.position.y + aa.position.y }
              e.route[4] = {x:e.route[5].x - dx, y: e.route[5].y - dy} 
              e.destinationAnchor = aa.id
              e.edgeData.destinationObject = a.id
            }
            break
          case EdgeLayout.NinetyDegree:
          case EdgeLayout.Rounded:
            if(eaid === 0) {
              oldNObj = e.edgeData.destinationObject
              oldNA = e.destinationAnchor
              let d = this.helpers.findAnchorableObject(this.canvasController.nodes, this.canvasController.junctions, a.id)
              e.sourceAnchor = aa.id
              e.edgeData.sourceObject = a.id
              let p:Position[] =  this.helpers.getFiveSegmentRoute(a, d, e)
            } else {
              oldNObj = e.edgeData.sourceObject
              oldNA = e.sourceAnchor
              let s = this.helpers.findAnchorableObject(this.canvasController.nodes, this.canvasController.junctions, a.id)
              e.destinationAnchor = aa.id
              e.edgeData.destinationObject = a.id
              let p:Position[] =  this.helpers.getFiveSegmentRoute(s, a, e)
            }
            break
        }
      }

      let oa = this.helpers.findAnchorableObject(this.canvasController.nodes, this.canvasController.junctions, oldNObj)
      a = this.helpers.addEdgeToAnchor(a, aa?.id as string, e.id)
      //oa = 
      this.helpers.removeEdgeToAnchor(oa, oldNA, eaid.toString())
      
      this.canvasController.replaceEdge(e)
      this.canvasController.replaceAnchorable(a)
      this.canvasController.replaceAnchorable(oa)
      
      this.canvasController.clearTempEdge()
      this.canvasController.setCanvasMode(CanvasMode.Ready)
    } else if(this.canvasController.mode === CanvasMode.AddEdge) {
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

      this.canvasController.setCanvasMode(CanvasMode.Ready)
    }
  }

  dragNewEdge = () => {
  }


}
