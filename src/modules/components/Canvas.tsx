import React, {MouseEventHandler, useState} from "react"
import Helpers from "../utilities/Helpers"
import { IModel } from "../structure/Model"
import { BaseNode } from "../renderer/BaseNode"
import { BaseEdge } from "../renderer/BaseEdge"
import { NodeType } from "../enums/enumNodeType"
import { ApplicationComponentNode } from "../renderer/ApplicationComponentNode"
import { BusinessInterfaceNode } from "../renderer/BusinessInterfaceNode"
import { BusinessActorNode } from "../renderer/BusinessActorNode"
import { BusinessRoleNode } from "../renderer/BusinessRoleNode"
import { BusinessCollaborationNode } from "../renderer/BusinessCollaborationNode"
import { BusinessProcessNode } from "../renderer/BusinessProcessNode"
import { BusinessFunctionNode } from "../renderer/BusinessFunctionNode"
import { BusinessInteractionNode } from "../renderer/BusinessInteractionNode"
import { BusinessEventNode } from "../renderer/BusinessEventNode"
import { BusinessServiceNode } from "../renderer/BusinessServiceNode"
import { BusinessObjectNode } from "../renderer/BusinessObjectNode"
import { BusinessContractNode } from "../renderer/BusinessContractNode"
import { BusinessProductNode } from "../renderer/BusinessProductNode"
import { BusinessRepresentationNode } from "../renderer/BusinessRepresentationNode"
import { ApplicationCollaborationNode } from "../renderer/ApplicationCollaborationNode"
import { ApplicationInterfaceNode } from "../renderer/ApplicationInterfaceNode"
import { ApplicationFunctionNode } from "../renderer/ApplicationFunctionNode"
import { ApplicationInteractionNode } from "../renderer/ApplicationInteractionNode"
import { ApplicationEventNode } from "../renderer/ApplicationEventNode"
import { ApplicationProcessNode } from "../renderer/ApplicationProcessNode"
import { ApplicationServiceNode } from "../renderer/ApplicationServiceNode"
import { ApplicationDataObjectNode } from "../renderer/ApplicationDataObject"
import { TechnologyArtifactNode } from "../renderer/TechnologyArtifactNode"
import { TechnologyCollaborationNode } from "../renderer/TechnologyCollaborationNode"
import { TechnologyCommunicationNetworkNode } from "../renderer/TechnologyCommunicationNetworkNode"
import { TechnologyDeviceNode } from "../renderer/TechnologyDeviceNode"
import { TechnologyEventNode } from "../renderer/TechnologyEventNode"
import { TechnologyFunctionNode } from "../renderer/TechnologyFunctionNode"
import { TechnologyInteractionNode } from "../renderer/TechnologyInteractionNode"
import { TechnologyInterfaceNode } from "../renderer/TechnologyInterfaceNode"
import { TechnologyPathNode } from "../renderer/TechnologyPathNode"
import { TechnologyProcessNode } from "../renderer/TechnologyProcessNode"
import { TechnologyServiceNode } from "../renderer/TechnologyServiceNode"
import { TechnologySystemSoftwareNode } from "../renderer/TechnologySystemSoftwareNode"
import { TechnologyNodeNode } from "../renderer/TechnologyNodeNode"
import { MotivationAssessmentNode } from "../renderer/MotivationAssessmentNode"
import { MotivationConstraintNode } from "../renderer/MotivationConstraintNode"
import { MotivationDriverNode } from "../renderer/MotivationDriverNode"
import { MotivationGoalNode } from "../renderer/MotivationGoalNode"
import { MotivationMeaningNode } from "../renderer/MotivationMeaningNode"
import { MotivationOutcomeNode } from "../renderer/MotivationOutcomeNode"
import { MotivationPrincipleNode } from "../renderer/MotivationPrincipleNode"
import { MotivationRequirementNode } from "../renderer/MotivationRequirementNode"
import { MotivationStakeholderNode } from "../renderer/MotivationStakeholderNode"
import { MotivationValueNode } from "../renderer/MotivationValueNode"
import { StrategyResourceNode } from "../renderer/StrategyResourceNode"
import { StrategyCapabilityNode } from "../renderer/StrategyCapabilityNode"
import { StrategyValueStreamNode } from "../renderer/StrategyValueStreamNode"
import { StrategyCourseOfActionNode } from "../renderer/StrategyCourseOfActionNode"
import { NodeParameters } from "../structure/NodeParameters"
import { NodeDisplayInstance } from "../structure/Node"
import { Edge, EdgeDisplayInstance } from "../structure/Edge"
import { DragData } from "../structure/DragData"
import { EdgeParameters } from "../structure/EdgeParameters"
import { NodeStatus } from "../enums/enumNodeStatus"
import { Position } from "../structure/Position"
import { NodeAnchorData } from "../structure/NodeAnchorData"
import { AnchorStatus } from "../enums/enumAnchorStatus"
import { CanvasMode } from "../enums/enumCanvasMode"
import { EdgeRelationshipTypes, EdgeRelationships } from "../enums/enumEdgeRelationships"
import { EdgeLayout } from "../enums/enumEdgeLayout"
import { DefaultValues } from "../structure/DefaultValues"
import { EdgeConstraints } from "../enums/enumEdgeConstraints"
import { EdgePropertyBox, EdgePropertyBoxProps } from "./EdgePropertyBox"
import { EdgeDataRenderer } from "./EdgeDataForm"

import './Canvas.css'
import { TechnologyEquipmentNode } from "../renderer/TechnologyEquipmentNode"
import { TechnologyFacilityNode } from "../renderer/TechnologyFacilityNode"
import { TechnologyDistributionNetworkNode } from "../renderer/TechnologyDistributionNetworkNode"
import { TechnologyMaterialNode } from "../renderer/TechnologyMaterialNode"

export type CanvasProps = {
  modelData?: IModel,
  defaults: DefaultValues
}

var helpers = new Helpers();

export interface CanvasInterface {
  return():React.Component
}

const nodeW = 180
const nodeH = 100

export const Canvas = (props:CanvasProps) => {
  let md:Array<NodeDisplayInstance> = []
  let defaults:DefaultValues = {
    edgeStyle: {
      weight: "1",
      layout:EdgeLayout.Straight,
      color: "red",
      style: "1 0"
    },
    edgeType: EdgeRelationships.Association
  }
  if(props.modelData) { md = props.modelData.nodes}
  if(props.defaults) {defaults = props.defaults }
  const [nodes, setNodes] = useState(md)
  const [mode, setMode] = useState<CanvasMode>(CanvasMode.Ready)
  const [propertyBox, setPropertyBox] = useState<JSX.Element[]>([])
 
  let pos:Position = {x:0, y:0}
  let ed:Array<EdgeDisplayInstance> = []

  if(props.modelData) { ed = props.modelData.edges}
  const [edges, setEdges] = useState(ed)

  let ds:DragData = { type:"none", currentId:"", offset: {x: 0, y:0}, position:{x:0, y:0} }
  let edd:EdgeDisplayInstance = { id:"temp", edgeData: { edgeId:'temp', name:'temp', sourceObject:'unknown', destinationObject:'unknown',  type: EdgeRelationships.Association, label:'temp'}, isSelected: false, isVisible:false, sourceAnchor:'unknown', destinationAnchor:'unknown', route: [{x:-1,y:-1},{x:-1, y:-1}], style: {weight:"1", layout: EdgeLayout.Straight, color: 'silver', style:'1'  }, anchors:[]}
  const [dragData, setDragData] = useState(ds)
  const [newEdgeData, setNewEdgeData] = useState<EdgeDisplayInstance>(edd)
  
  let newEdge:JSX.Element = <span></span>

  let select = (type:string, id:string, offset:Position, position:Position) => {
    let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
      if(n.id === id && type === "node") {
        n.isSelected = true
        //helpers.setPointerEvents("node", id)
      } else {
        n.isSelected = false;
      }
      return n
    })
    setNodes(na)

    let ea:Array<EdgeDisplayInstance> = edges.map((e, i)=>{
      let iid:string = id.split(":")[0]
      if((e.id === id && type === "edge") || (e.id === iid && type==="edgeAnchor") || (e.id === iid && type==="edgeHandle")) {
        e.isSelected = true
      } else {
        e.isSelected = false
      }
      return e
    })
    setDragData({type:type, currentId: id, offset:offset, position:position} )
  }

  let clearSelect = () => {
    helpers.clearPointerEvents()
    setPropertyBox([])
    //clearSelect()
    let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
      n.isSelected=false
      return n
    })
    setNodes(na)

    let ea:Array<EdgeDisplayInstance> = edges.map((e, i)=>{
      e.isSelected=false
      return e
    })
  
    setEdges(ea)
    setDragData({type: 'none', currentId: "", offset:{x:0, y:0}, position:{x: 0, y: 0}})
  }

  let backgroundMove = (e:React.MouseEvent<SVGElement>) => {
    let pos:Position = {x:0, y:0}
    pos.x = e.clientX
    pos.y = e.clientY
    const bbox = e.currentTarget.getBoundingClientRect()
    if(e.shiftKey && mode === CanvasMode.AddEdge) {
      let ed:EdgeDisplayInstance = newEdgeData
      ed.route[1] = {x:e.clientX - bbox.left, y:e.clientY-bbox.top}
      
      let el = document.getElementById('temp')
      if(el) {
        let sn:NodeDisplayInstance = nodes.find((n) => { return n.id === newEdgeData.edgeData.sourceObject}) as NodeDisplayInstance
        let sa:NodeAnchorData = sn.anchors.find((a) => { return a.id === newEdgeData.sourceAnchor}) as NodeAnchorData
        let p:string = (sn.position.x + sa.position.x) + "," + (sn.position.y + sa.position.y) + " " + (ed.route[1].x) +"," + (ed.route[1].y)
        el.setAttribute("points", p)
      }
      setNewEdgeData(ed);
    } else if(mode===CanvasMode.MoveEdgeAnchor) {
      let ea:Array<EdgeDisplayInstance> = edges.map((ed:EdgeDisplayInstance) => { 
        if(ed.id === dragData.currentId.split(":")[0] ) { 
          let pos:Position = {x:-1, y:-1}
          let i:number = 1
          pos.x = e.pageX - dragData.offset.x
          pos.y = e.pageY - (dragData.offset.y + 30)
          let p:Array<Position> = structuredClone(ed.route)
            
          if(dragData.currentId.endsWith(":M0")) {
            let ep:Element|null = document.getElementById(dragData.currentId)  
            let hp:Element|null = document.getElementById(dragData.currentId.split(":")[0] + ":HC2:C")  
            let offset:Position = { x: (Number.parseInt(ep?.getAttribute("x") as string) - Number.parseInt(hp?.getAttribute("cx") as string)),
                                     y: (Number.parseInt(ep?.getAttribute("y") as string) - Number.parseInt(hp?.getAttribute("cy") as string))}
            p[2] = {x:  e.clientX - bbox.left - offset.x , y: e.clientY - bbox.top - offset.y}
            p[3] = { x:  e.clientX - bbox.left, y:  e.clientY - bbox.top}

            ed.route = p

          } else {

            //const isMiddle:boolean = dragData.currentId.split(":")[1].endsWith(".5")
            const target:number = Number.parseInt(dragData.currentId.split(":")[1].split(".")[0])
            const a:HTMLElement = document.getElementById(dragData.currentId) as HTMLElement
            const constraint:Number = Number.parseInt(a.getAttribute("data-constraint") as string)
            
            ed.route.forEach((el) => {  // <<<<<<<<<<<<<<<< iterate through route of the edge
              let pt:Position = structuredClone(ed.route[i])
              //let mod:number = 1
              
              if(constraint === EdgeConstraints.Vertical || constraint === EdgeConstraints.None) {
                if(i === target - 1 && ed.route[i].x === ed.route[target].x) {
                  pt.x =  e.clientX - bbox.left
                }
                if(i === target) {
                  pt.x =  e.clientX - bbox.left
                }
                if(i === target + 1  && ed.route[i].x === ed.route[target].x ) {
                  pt.x = e.clientX - bbox.left
                }
              }

              if(constraint === EdgeConstraints.Horizontal || constraint === EdgeConstraints.None) {
                if(i === target - 1 && ed.route[i].y === ed.route[target].y) {
                  pt.y =  e.clientY - bbox.top
                }
                if(i === target) {
                  pt.y =  e.clientY - bbox.top
                }
                if(i === target + 1  && ed.route[i].y === ed.route[target].y ) {
                  pt.y =  e.clientY - bbox.top
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
      
      setEdges(ea)

    } else if(mode===CanvasMode.MoveEdgeHandle) {
      if(e && (e.target instanceof Element) && (e.currentTarget)){
        const eid = dragData.currentId.split(":")[0]
        const hid = dragData.currentId.split(":")[1]

        const p:Position = {x: e.clientX - bbox.left, y: e.clientY - bbox.top}
      
        if(eid && hid)  {
          let c = document.getElementById(eid + ":" + hid + ":C")
          let l = document.getElementById(eid + ":" + hid + ":L")
          let ed = document.getElementById(eid)
          let edbg = document.getElementById(eid + ":bg")
          c?.setAttribute('cx',  ("" + (e.clientX - bbox.left))) 
          c?.setAttribute('cy',  ("" + (e.clientY - bbox.top)))    
          l?.setAttribute('x1',  ("" + (e.clientX - bbox.left)))
          l?.setAttribute('y1',  ("" + (e.clientY - bbox.top))) 

          let ds = ed?.getAttribute('d')
          let d:string[]|undefined = ds?.split(" ") 
          
          if(d!=undefined ) {
            if(hid === 'HC2') {
              let pivot = {x: Number.parseInt(d[5].split(",")[0]), y: Number.parseInt(d[5].split(",")[1])}
              let i:Position = helpers.getInverse(p, pivot)
              let c2 = document.getElementById(eid + ":HC2I:C")
              let l2 = document.getElementById(eid + ":HC2I:L")
              c2?.setAttribute('cx',  ("" + i.x))
              c2?.setAttribute('cy',  ("" + i.y))   
              l2?.setAttribute('x1',  ("" + i.x))
              l2?.setAttribute('y1',  ("" + i.y))   
            } else if (hid === 'HC2I') {
              let pivot = {x: Number.parseInt(d[5].split(",")[0]), y: Number.parseInt(d[5].split(",")[1])}
              let i:Position = helpers.getInverse(p, pivot)
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
              let i:Position = helpers.getInverse(p, pivot)
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
    } else if(mode===CanvasMode.MovePropertyBox) {
      if(e && (e.target instanceof Element) && (e.currentTarget) && e.button === 0){
        let box:HTMLElement = document.getElementById("edge-property-box") as HTMLElement
        if(box) {
          box.setAttribute("style", "left: " + (e.clientX - bbox.left) + "px; top: " + (e.clientY - bbox.top) + "px;")
        } 
      }
    }
  }

  let backgroundMouseUp = (e:React.MouseEvent<SVGElement>) => {
    if(mode===CanvasMode.MoveEdgeAnchor || mode === CanvasMode.MoveEdgeHandle) {
      setMode(CanvasMode.Ready)
      helpers.clearPointerEvents()
      //setDragData({type:'none', currentId:'', offset:{x:-1, y:-1}, position:{x:-1, y: -1}})
      clearSelect()
    }
  }

  let np:NodeParameters = {
    canvasMode:mode,
    setHoverNode: (e:React.PointerEvent<SVGElement>) => { 
      if(e && (e.target instanceof Element)) {
        const id = e.target.getAttribute("data-node-id")
        const el = e.target.getAttribute("data-element")
        if(el=="frame") {
          e.target.setAttribute("stroke-width", "2")
          e.target.setAttribute("stroke", "gray")
        }
      }
    },
    clearHoverNode: (e:React.PointerEvent<SVGElement>) => {
      if(e && (e.target instanceof Element)){
        const id = e.target.getAttribute("data-node-id")
        const el = e.target.getAttribute("data-element")
        if(el=="frame") {
          e.target.setAttribute("stroke-width", "1")
          e.target.setAttribute("stroke", "grey")
        }
      }
    },
    setSelectedNode: (e:React.PointerEvent<SVGElement>) => { 
      if(e && (e.target instanceof Element) && mode === CanvasMode.Ready){
        const id = e.target.getAttribute("data-node-id")
        const el = e.target.getAttribute("data-element")
        if(el=="frame" && props.modelData) {
          e.target.setAttribute("stroke-width", "1")
          e.target.setAttribute("stroke", "green")
          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.nodeData.nodeId==id) {
              n.isSelected=true
            } else {
              n.isSelected=false;
            }
            return n;
          })
          setNodes(na)
        }
      }
    },
    startMoveNode: (e:React.PointerEvent<SVGElement>) => {
      if(e && (e.target instanceof Element) && (e.currentTarget) && !e.shiftKey && mode === CanvasMode.Ready){
        const id = e.target.getAttribute("data-node-id")
        const el = e.target.getAttribute("data-element")
        const bbox = e.currentTarget.getBoundingClientRect();
        select("node", e.currentTarget.id, {x: e.clientX - bbox.left, y:e.clientY - bbox.top}, {x: e.clientX, y: e.clientY})
        if(el=="frame") {
          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.id === e.currentTarget.id) {
              n.isSelected=false
              n.status = NodeStatus.Moving
              n.oldPosition = {x: n.position.x, y: n.position.y}
            } 
            return n
          })
          setNodes(na)
          setMode(CanvasMode.MoveNode)
        } else {
          clearSelect()
          setMode(CanvasMode.Ready);
        } 
      }
    },
    inMove: (e:React.PointerEvent<SVGElement>) => {
      if(dragData.type==='node' && dragData.currentId.length > 0 && e && (e.target instanceof Element) && (e.currentTarget) ){
        const el = e.target.getAttribute("data-element")
        const bbox = e.currentTarget.getBoundingClientRect()
        if(el=="frame" && e.currentTarget.id == dragData.currentId && !e.shiftKey && mode === CanvasMode.MoveNode) {
          let ea:Array<EdgeDisplayInstance> = edges.map((ed) => {
            if(ed.edgeData.sourceObject === dragData.currentId && ed.style.layout === EdgeLayout.Bezier ) {
              let p:Array<Position> = structuredClone(ed.route)
              const pos:Position = {x: e.pageX - dragData.offset.x, y: e.pageY - (dragData.offset.y +30)}
              let n:NodeDisplayInstance = nodes.find((nd) => { return nd.id === ed.edgeData.sourceObject}) as NodeDisplayInstance
              let handleOffset:Position = {x: p[1].x - p[0].x, y: p[1].y - p[0].y} //difference between anchor and handle
              let anchorOffset:Position = {x:p[0].x - (n.position.x), y: p[0].y - (n.position.y)}
              p[0] = {x: pos.x + anchorOffset.x, y:pos.y + anchorOffset.y }
              p[1] = {x: pos.x + anchorOffset.x + handleOffset.x , y: pos.y + anchorOffset.y + handleOffset.y}
              ed.route = p
            }

            if(ed.edgeData.destinationObject === dragData.currentId && ed.style.layout === EdgeLayout.Bezier ) {
              let p:Array<Position> = structuredClone(ed.route)
              const pos:Position = {x: e.pageX - dragData.offset.x, y: e.pageY - (dragData.offset.y +30)}
              let n:NodeDisplayInstance = nodes.find((nd) => { return nd.id === ed.edgeData.destinationObject}) as NodeDisplayInstance
              let handleOffset:Position = {x: p[4].x - p[5].x, y: p[4].y - p[5].y} //difference between anchor and handle
              let anchorOffset:Position = {x:p[5].x - (n.position.x), y: p[5].y - (n.position.y)}
              p[5] = {x: pos.x + anchorOffset.x, y:pos.y + anchorOffset.y }
              p[4] = {x: pos.x + anchorOffset.x + handleOffset.x , y: pos.y + anchorOffset.y + handleOffset.y}
              ed.route = p
            }
            return ed
          })

          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.id === e.currentTarget.id) {
              n.position.x = e.pageX - dragData.offset.x
              n.position.y = e.pageY - (dragData.offset.y +30)

              for(let i=0; i < n.anchors.length; i++) {
                if(n.anchors[i].edges.length > 0) {
                  n.anchors[i].edges.forEach((et: string)=> {
                    let e:EdgeDisplayInstance | undefined = edges.find((er) => { return er.id === et})
                    if(e) {
                      e.route = helpers.getAdjustedRoute(nodes, e, n.id)
                    }
                  })
                }
              }
            } 
            return n
          })
          setNodes(na)
          setEdges(ea)
        } else if(e.shiftKey && mode === CanvasMode.AddEdge) {
          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.id === e.currentTarget.id) {
              n.position.x = e.pageX - dragData.offset.x
              n.position.y = e.pageY - (dragData.offset.y +30)
              n.isSelected = true;
            } 
            return n
          })
          setNodes(na)
        }
      }
    },
    endMoveNode: (e:React.PointerEvent<SVGElement>) => {
      if(e && (e.target instanceof Element)) { 
        //clearSelect()
        const id = e.target.getAttribute("data-node-id")
        const el = e.target.getAttribute("data-element")
        if(el=="frame" && props.modelData) {
          e.target.setAttribute("stroke-width", "1")
          e.target.setAttribute("stroke", "green")
          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.nodeData.nodeId==id) {
              n.isSelected=true
              n.status = NodeStatus.Ready;
            } else {
              n.isSelected=false;
            }
            return n;
          })
          setNodes(na)
          setMode(CanvasMode.Ready)
        }
        
      }
      
      setDragData({type:"none", currentId: "", offset:{x:0, y:0}, position:{x: 0, y: 0}})
    },
    addAnchor: (e:React.PointerEvent<SVGElement>, pos:Position) => {
      if(e && (e.target instanceof Element) && (e.currentTarget)){
        const id = e.target.getAttribute("data-node-id")
        if(id) {
          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.id === e.currentTarget.id) {
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
          setNodes(na)
        }
      }
    },
    anchorParams: {
      setHoverAnchor: (e:MouseEvent) => {
        if(e && (e.target instanceof Element)) {
          e.target.setAttribute("stroke-width", "3")
          e.target.setAttribute("stroke", "orange")
          if(mode===CanvasMode.AddEdge && e.shiftKey) {
            e.target.setAttribute("fill", "green")
          }
        }
      },
      clearHoverAnchor: (e:Event) => {
        if(e && (e.target instanceof Element)){
          e.target.setAttribute("stroke-width", "1")
          e.target.setAttribute("stroke", "black")
        }
      },
      setSelectedAnchor: (e:MouseEvent)=> {
        if(e && (e.target instanceof Element)) {
          
          const nid= e.target.id.split(":")[0]
          const aid = e.target.id.split(":")[1]
          if(e.shiftKey) {
            let nn:NodeDisplayInstance = nodes.find((nd)=> { return nd.id === nid}) as NodeDisplayInstance
            let aa:NodeAnchorData = nn.anchors.find((an) => {return an.id === aid} ) as NodeAnchorData
            e.target.setAttribute("stroke-width", "3")
            e.target.setAttribute("stroke", "green")
            let ned = newEdgeData
            ned.edgeData.sourceObject = nid
            ned.sourceAnchor=aid
            ned.route=[{x:nn.position.x + aa.position.x , y:nn.position.y + aa.position.y}, {x:nn.position.x + aa.position.x, y:nn.position.y + aa.position.y}]
            setMode(CanvasMode.AddEdge)
            setNewEdgeData(ned)
          } else {
          }
        }
      },
      setNewEdgeEndPoint: (e:MouseEvent)=> {
        let ed:EdgeDisplayInstance = structuredClone(newEdgeData);
        let hed:EdgeDisplayInstance = structuredClone(newEdgeData);
        if(e.target && (e.target instanceof Element) && mode === CanvasMode.AddEdge) {
          let nid = e.target.id.split(":")[0]
          let aid = e.target.id.split(":")[1]
          let dn = nodes.find((n) => { return n.id === nid}) as NodeDisplayInstance
          let an = dn?.anchors.find((a) => { return a.id === aid}) as NodeAnchorData
          ed.edgeData.destinationObject = nid
          ed.destinationAnchor = aid
          ed.id = crypto.randomUUID()
          ed.isSelected=true
          ed.isVisible=true
          ed.style=defaults.edgeStyle
          ed.edgeData.edgeId = crypto.randomUUID();
          
          let ea:Array<EdgeDisplayInstance> = edges.map((e, i)=>{
            return e
          })
          ea.push(ed)

          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.id === ed.edgeData.sourceObject) {
              for(let i:number = 0; i < n.anchors.length; i++) {
                if(n.anchors[i].id === ed.sourceAnchor) {
                  if(!n.anchors[i].edges.includes("ed.id")) {
                    n.anchors[i].edges.push(ed.id)
                  }
                }
              }
            }
            if(n.id === ed.edgeData.destinationObject) {
              for(let i:number = 0; i < n.anchors.length; i++) {
                if(n.anchors[i].id === ed.destinationAnchor) {
                  if(!n.anchors[i].edges.includes("ed.id")) {
                    n.anchors[i].edges.push(ed.id)
                  }
                }
              }
            }
            return n;
          })
          setNodes(na)
          hed.route = [{x:-1, y:-1}, {x:-1, y:-1}]
          setNewEdgeData(hed)
          setEdges(ea)
          setMode(CanvasMode.Ready)
        }
      },
      dragNewEdge:  (e:MouseEvent)=> {
      }
    },
    inAddAnchor: (e:React.PointerEvent<SVGElement>) => {
      if(e && (e.target instanceof Element)){
        const id = e.target.getAttribute("data-node-id")
        const el = e.target.getAttribute("data-element")
        if(el=="frame" && props.modelData) {
          e.target.setAttribute("stroke-width", "1")
          e.target.setAttribute("stroke", "green")
          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.nodeData.nodeId==id) {
              n.isSelected=true
              n.status = NodeStatus.AddAnchor;
            } else {
              n.isSelected=false;
            }
            return n;
          })
          setNodes(na)
        }
      }
    },
    setReady: (e:React.PointerEvent<SVGElement>) => {
      if(e && (e.target instanceof Element)){
        const id = e.target.getAttribute("data-node-id")
        const el = e.target.getAttribute("data-element")
        if(el=="frame" && props.modelData) {
          e.target.setAttribute("stroke-width", "1")
          e.target.setAttribute("stroke", "green")
          let na:Array<NodeDisplayInstance> = nodes.map((n, i)=>{
            if(n.nodeData.nodeId==id) {
       //       n.isSelected=true
              n.status = NodeStatus.Ready;
            } else {
              n.isSelected=false;
            }
            return n;
          })
          setNodes(na)
        }
      }
    },
    index:0
  }
  
  let els:Array<JSX.Element> = [];
  let cvsW = 0;
  let cvsH = 0;
  let i:number=0;

  nodes.forEach((n)=> {
      if(n.isVisible) {
        if(n.position.x + nodeW > cvsW) { cvsW = n.position.x + nodeW}
        if(n.position.y + nodeH > cvsH) { cvsH = n.position.y + nodeH}

        np.index = i++;
        switch(n.nodeData.type) {
          case NodeType.ApplicationComponent:
            let niac:JSX.Element = new ApplicationComponentNode(n, np).Render()
            els.push(niac)
            break
          case NodeType.ApplicationCollaboration:
            let niacl:JSX.Element = new ApplicationCollaborationNode(n, np).Render()
            els.push(niacl)
            break
          case NodeType.ApplicationInterface:
            let niain:JSX.Element = new ApplicationInterfaceNode(n,np).Render()
            els.push(niain)
            break
          case NodeType.ApplicationFunction:
            let niaf:JSX.Element = new ApplicationFunctionNode(n, np).Render()
            els.push(niaf)
            break
          case NodeType.ApplicationInteraction:
            let niaif:JSX.Element = new ApplicationInteractionNode(n, np).Render()
            els.push(niaif)
            break
          case NodeType.ApplicationEvent:
            let niae:JSX.Element = new ApplicationEventNode(n, np).Render()
            els.push(niae)
            break
          case NodeType.ApplicationProcess:
            let niap:JSX.Element = new ApplicationProcessNode(n, np).Render()
            els.push(niap)
            break
          case NodeType.ApplicationService:
            let nias:JSX.Element = new ApplicationServiceNode(n, np).Render()
            els.push(nias)
            break
          case NodeType.ApplicationDataObject:
            let niado:JSX.Element = new ApplicationDataObjectNode(n, np).Render()
            els.push(niado)
            break
          case NodeType.BusinessActor:
            let niba:JSX.Element = new BusinessActorNode(n, np).Render()
            els.push(niba)
            break
          case NodeType.BusinessRole:
            let nibr:JSX.Element = new BusinessRoleNode(n, np).Render()
            els.push(nibr)
            break
          case NodeType.BusinessInterface:
            let nibi:JSX.Element = new BusinessInterfaceNode(n, np).Render()
            els.push(nibi)
            break
          case NodeType.BusinessCollaboration:
            let nibc:JSX.Element = new BusinessCollaborationNode(n, np).Render()
            els.push(nibc)
            break
          case NodeType.BusinessProcess:
            let nibp:JSX.Element = new BusinessProcessNode(n, np).Render()
            els.push(nibp)
            break
          case NodeType.BusinessProduct:
              let nibpr:JSX.Element = new BusinessProductNode(n, np).Render()
              els.push(nibpr)
              break
          case NodeType.BusinessFunction:
            let nibf:JSX.Element = new BusinessFunctionNode(n, np).Render()
            els.push(nibf)
            break
          case NodeType.BusinessInteraction:
            let nibin:JSX.Element = new BusinessInteractionNode(n, np).Render()
            els.push(nibin)
            break
          case NodeType.BusinessEvent:
            let nibe:JSX.Element = new BusinessEventNode(n, np).Render()
            els.push(nibe)
            break
          case NodeType.BusinessService:
            let nibs:JSX.Element = new BusinessServiceNode(n, np).Render()
            els.push(nibs)
            break
          case NodeType.BusinessObject:
            let nibo:JSX.Element = new BusinessObjectNode(n, np).Render()
            els.push(nibo)
            break
          case NodeType.BusinessContract:
            let nibco:JSX.Element = new BusinessContractNode(n, np).Render()
            els.push(nibco)
            break
          case NodeType.BusinessRepresentation:
            let nibrp:JSX.Element = new BusinessRepresentationNode(n, np).Render()
            els.push(nibrp)
            break
          case NodeType.TechnologyArtifact:
            let nita:JSX.Element = new TechnologyArtifactNode(n, np).Render()
            els.push(nita)
            break
          case NodeType.TechnologyCollaboration:
            let nitc:JSX.Element = new TechnologyCollaborationNode(n, np).Render()
            els.push(nitc)
            break
          case NodeType.TechnologyCommunicationNetwork:
            let nitcn:JSX.Element = new TechnologyCommunicationNetworkNode(n, np).Render()
            els.push(nitcn)
            break
          case NodeType.TechnologyDevice:
            let nitd:JSX.Element = new TechnologyDeviceNode(n, np).Render()
            els.push(nitd)
            break
            case NodeType.TechnologyEvent:
            let nite:JSX.Element = new TechnologyEventNode(n, np).Render()
            els.push(nite)
            break
          case NodeType.TechnologyFunction:
            let nitf:JSX.Element = new TechnologyFunctionNode(n, np).Render()
            els.push(nitf)
            break
          case NodeType.TechnologyInteraction:
            let niti:JSX.Element = new TechnologyInteractionNode(n, np).Render()
            els.push(niti)
            break
          case NodeType.TechnologyInterface:
            let nitif:JSX.Element = new TechnologyInterfaceNode(n, np).Render()
            els.push(nitif)
            break
          case NodeType.TechnologyPath:
            let nitp:JSX.Element = new TechnologyPathNode(n, np).Render()
            els.push(nitp)
            break
          case NodeType.TechnologyProcess:
            let nitpr:JSX.Element = new TechnologyProcessNode(n, np).Render()
            els.push(nitpr)
            break
          case NodeType.TechnologyService:
            let nits:JSX.Element = new TechnologyServiceNode(n, np).Render()
            els.push(nits)
            break
          case NodeType.TechnologySystemSoftware:
            let nitss:JSX.Element = new TechnologySystemSoftwareNode(n, np).Render()
            els.push(nitss)
            break
          case NodeType.TechnologyNode:
            let nitn:JSX.Element = new TechnologyNodeNode(n, np).Render()
            els.push(nitn)
            break
          case NodeType.TechnologyEquipment:
            let niteq:JSX.Element = new TechnologyEquipmentNode(n, np).Render()
            els.push(niteq)
            break
          case NodeType.TechnologyFacility:
            let nitfa:JSX.Element = new TechnologyFacilityNode(n, np).Render()
            els.push(nitfa)
            break
          case NodeType.TechnologyDistributionNetwork:
            let nitdn:JSX.Element = new TechnologyDistributionNetworkNode(n, np).Render()
            els.push(nitdn)
            break
          case NodeType.TechnologyMaterial:
            let nitm:JSX.Element = new TechnologyMaterialNode(n, np).Render()
            els.push(nitm)
            break
          case NodeType.MotivationAssesment:
            let nima:JSX.Element = new MotivationAssessmentNode(n, np).Render()
            els.push(nima)
            break
          case NodeType.MotivationConstraint:
            let nimc:JSX.Element = new MotivationConstraintNode(n, np).Render()
            els.push(nimc)
            break
          case NodeType.MotivationDriver:
            let nimd:JSX.Element = new MotivationDriverNode(n, np).Render()
            els.push(nimd)
            break
          case NodeType.MotivationGoal:
            let nimg:JSX.Element = new MotivationGoalNode(n, np).Render()
            els.push(nimg)
            break
          case NodeType.MotivationMeaning:
            let nimm:JSX.Element = new MotivationMeaningNode(n, np).Render()
            els.push(nimm)
            break
          case NodeType.MotivationOutcome:
            let nimo:JSX.Element = new MotivationOutcomeNode(n, np).Render()
            els.push(nimo)
            break
          case NodeType.MotivationPrinciple:
            let nimp:JSX.Element = new MotivationPrincipleNode(n, np).Render()
            els.push(nimp)
            break
          case NodeType.MotivationRequirement:
            let nimr:JSX.Element = new MotivationRequirementNode(n, np).Render()
            els.push(nimr)
            break
          case NodeType.MotivationStakeholder:
            let nims:JSX.Element = new MotivationStakeholderNode(n, np).Render()
            els.push(nims)
            break
          case NodeType.MotivationValue:
            let nimv:JSX.Element = new MotivationValueNode(n, np).Render()
            els.push(nimv)
            break
          case NodeType.StrategyResource:
            let nisr:JSX.Element = new StrategyResourceNode(n, np).Render()
            els.push(nisr)
            break
          case NodeType.StrategyCapability:
            let nisc:JSX.Element = new StrategyCapabilityNode(n, np).Render()
            els.push(nisc)
            break
          case NodeType.StrategyValueStream:
            let nisvs:JSX.Element = new StrategyValueStreamNode(n, np).Render()
            els.push(nisvs)
            break
          case NodeType.StrategyCourseOfAction:
            let niscoa:JSX.Element = new StrategyCourseOfActionNode(n, np).Render()
            els.push(niscoa)
            break
          default:
            let ni:JSX.Element = new BaseNode(n, np).Render()
            els.push(ni)
        }
      }
  })

  let ep:EdgeParameters = {
    index:200,
    setHoverEdge: (e: React.PointerEvent<SVGElement>) => {
      if (e && (e.target instanceof Element)) {
        const id = e.target.getAttribute("id")?.split(":")[0];
        const tgt = document.getElementById(id as string) as Element;
        const el = e.target.getAttribute("data-element");
        if (el == "connector") {
          tgt.setAttribute("stroke-width", "3");
          tgt.setAttribute("stroke", "teal");
        }
      }
    },
    setSelectedEdge: (e: React.PointerEvent<SVGElement>) => {
      if (e && (e.target instanceof Element)) {
        
        const id = e.target.getAttribute("id")?.split(":")[0]
        let ea: Array<EdgeDisplayInstance> = edges.map((e, i) => {
          if (e.id === id) {
            e.isSelected = true
          } else {
            e.isSelected = false
          }
          return e
        });


        let  params:EdgePropertyBoxProps = {
          id:id as string,
          data:(edges.find((ed) => { return ed.id === id}))?.edgeData as Edge,
          dataRenderer: EdgeDataRenderer,
          dragStart: (e:React.PointerEvent<HTMLDivElement>) => {
            if(e && (e.target instanceof Element) && (e.currentTarget) && !e.shiftKey && mode === CanvasMode.Ready){
              let nodeEls = document.getElementsByClassName("toggle-pointer")
              for (let i: number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.add("no-pointer-events"); }
              const bbox = e.currentTarget.getBoundingClientRect();
              setDragData({type: 'property-box', currentId: e.currentTarget.id, offset:{x: e.clientX - bbox.left, y:e.clientY - bbox.top}, position:{x: e.clientX, y: e.clientY}})
              setMode(CanvasMode.MovePropertyBox)
            }
          },
          dragDone: (e:React.PointerEvent<HTMLDivElement>) => {
            if(e && (e.target instanceof Element) && (e.currentTarget) && !e.shiftKey && mode === CanvasMode.Ready){
              // let el:Element|null = document.getElementById("edge-property-box")
              // if(el) el.classList.remove("no-pointer-events")
              // el = document.getElementById("edge-inner-property-panel")
              // if(el) el.classList.remove("no-pointer-events")
              let nodeEls = document.getElementsByClassName("toggle-pointer")
              for (let i: number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.remove("no-pointer-events"); }
              setDragData({type: 'none', currentId: "", offset:{x: -1, y:-1}, position:{x: -1, y: -1}})
              setMode(CanvasMode.Ready)
            }
          },
          setEdgeLayout: (id:string, layout:EdgeLayout) => {
            helpers.changeEdgeLayout(edges, nodes, id, layout, setEdges)
          },
          setEdgeType: (tgt:string, id:EdgeRelationships) => {
            let ea:EdgeDisplayInstance[] = edges.map((ed) => {
              if(ed.edgeData.edgeId === tgt) {
                ed.edgeData.type = id
              }
              return ed
            })
            setEdges(ea)
          },
          remove: () => {
            let tgt:number = edges.findIndex((e)=>{return e.isSelected===true})
            edges.splice(tgt, 1)
            setEdges(edges)
          },
          position:{x:e.clientX + 30, y:e.clientY + 30 }
        }

        let propbox = <EdgePropertyBox {...params} />
        propertyBox.push(propbox)

        let nodeEls = document.getElementsByClassName("node");
        for (let i: number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.add("no-pointer-events"); }
        
        setEdges(ea);
      }
    },
    setLeaveEdge: (e: React.PointerEvent<SVGElement>) => {
      if (e && (e.target instanceof Element) && mode != CanvasMode.AddEdge) {
        const id = e.target.getAttribute("id")?.split(":")[0];
        const tgt = document.getElementById(id as string) as Element;
        const el = e.target.getAttribute("data-element");
        if (el == "connector") {
          let ed: EdgeDisplayInstance = edges.find((t) => { return t.id === id; }) as EdgeDisplayInstance;
          if (ed.style) {
            tgt.setAttribute("stroke-width", ed.style.weight);
            tgt.setAttribute("stroke", ed.style.color);
          } else {
          }
        }
      }
    },
    anchorParams: {
      selectAnchor: (e: React.PointerEvent<SVGElement>) => {
        if (e && (e.target instanceof Element) && (e.currentTarget)) {
          const id = e.target.getAttribute("id");
          const bbox = e.currentTarget.getBoundingClientRect();
          setMode(CanvasMode.MoveEdgeAnchor);
          select('edgeAnchor', id as string, { x: e.clientX - bbox.left, y: e.clientY - bbox.top }, { x: e.clientX, y: e.clientY })
        }
      },
      moveAnchor: (e: React.MouseEvent<SVGElement>) => {
      },
      dropAnchor: (e: React.PointerEvent<SVGElement>) => {
        setMode(CanvasMode.Ready);
        setDragData({ type: 'none', currentId: '', offset: { x: -1, y: -1 }, position: { x: -1, y: -1 } });
        helpers.clearPointerEvents()
      }
    },
    dragDone: (e: React.PointerEvent<SVGElement>) => {
      if(mode === CanvasMode.MoveEdgeAnchor) {
        setDragData({type:'none', currentId:'', offset:{x:-1, y:-1}, position:{x:-1, y: -1}})
      }
    },
    handleParams: {
      setSelectedHandle: (e: React.PointerEvent<SVGElement>) => {
        if (e && (e.target instanceof Element) && (e.currentTarget) && !e.shiftKey ) {
          const id = e.target.getAttribute("id")
          const bbox = e.currentTarget.getBoundingClientRect()
          setMode(CanvasMode.MoveEdgeHandle)
          select('edgeHandle', id as string,  { x: e.clientX - bbox.left, y: e.clientY - bbox.top }, { x: e.clientX, y: e.clientY })
        }
      },
      moveHandle: (e: React.PointerEvent<SVGElement>) => {
        if (e && (e.target instanceof Element) && (e.currentTarget) && mode === CanvasMode.MoveEdgeHandle) {
          const eid = e.target.getAttribute("id")?.split(":")[0];
          const hid = e.target.getAttribute("id")?.split(":")[1];

          if (eid && hid) {
            let ed: EdgeDisplayInstance = edges.find((t) => { return t.id === eid; }) as EdgeDisplayInstance;
          }
        }
      }, endMoveHandle: (e: React.PointerEvent<SVGElement>) => {
        setMode(CanvasMode.Ready);
        setDragData({ type: 'none', currentId: '', offset: { x: -1, y: -1 }, position: { x: -1, y: -1 } });
      }
    },
    
  }

  edges.forEach((e) => {
    if(e.isVisible) {
      const src:NodeDisplayInstance|undefined = nodes.find((n)=>{ return n.id == e.edgeData.sourceObject})
      const dst:NodeDisplayInstance|undefined = nodes.find((n)=>{ return n.id == e.edgeData.destinationObject})
      e.route = helpers.getAdjustedRoute(nodes, e, dragData.currentId)
      let ei:JSX.Element = new BaseEdge(e, ep).Render()
      els.push(ei)
    }
  })

  cvsW = cvsW + 100
  cvsH = cvsH + 100

  let ne:EdgeDisplayInstance = newEdgeData
  newEdge = new BaseEdge(ne, ep).Render()

  return <div className="canvas" style={{"height": "" + cvsH + "px" , "width": +"" + cvsW + "px" }}>
    <svg id="canvas" version="2.0" height={cvsH} width={cvsW} >
      <rect x="0" y="0" width={cvsW} height={cvsH} fill="#efffff" onClick={clearSelect} onMouseMove={backgroundMove} onMouseUp={backgroundMouseUp}/>
      { els }
      { newEdge }
    </svg>
    { propertyBox[0] }
    <span className='debug-data'>{helpers.getEnumName(CanvasMode, mode) }</span>
  </div>
}