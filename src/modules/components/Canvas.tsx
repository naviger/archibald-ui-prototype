import React, {useEffect, useState} from "react"
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
import { Position } from "../structure/Position"
import { CanvasMode } from "../enums/enumCanvasMode"
import { EdgeRelationships } from "../enums/enumEdgeRelationships"
import { EdgeLayout } from "../enums/enumEdgeLayout"
import { DefaultValues } from "../structure/DefaultValues"
import { EdgePropertyBox, EdgePropertyBoxProps } from "./EdgePropertyBox"
import { EdgeDataRenderer } from "./EdgeDataForm"
import './Canvas.css'
import { TechnologyEquipmentNode } from "../renderer/TechnologyEquipmentNode"
import { TechnologyFacilityNode } from "../renderer/TechnologyFacilityNode"
import { TechnologyDistributionNetworkNode } from "../renderer/TechnologyDistributionNetworkNode"
import { TechnologyMaterialNode } from "../renderer/TechnologyMaterialNode"
import { Junction } from "../renderer/Junction"
import { JunctionDisplayInstance } from "../structure/Junction"
import { JunctionParameters } from "../structure/JunctionParameters"
import { JunctionHandler } from "../handler/JunctionHandler"
import { NodeAnchorHandler, NodeHandler } from "../handler/NodeHandler"
import { CanvasController } from "../handler/CanvasController"
import { EdgeAnchorHandler, EdgeHandleHandler, EdgeHandler } from "../handler/EdgeHandler"
import { EdgePropertyBoxHandler } from "../handler/EdgePropertyBoxHandler"
import { History } from '../structure/History'

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
  let ed:Array<EdgeDisplayInstance> = []
  let jd:Array<JunctionDisplayInstance> = []

  let defaults:DefaultValues = props.defaults
 
  if(props.defaults) {defaults = props.defaults }
  let ds:DragData = { type:"none", currentId:"", offset: {x: 0, y:0}, position:{x:0, y:0} }

  const [dragData, setDragData] = useState(ds)
  const [mode, setMode] = useState<CanvasMode>(CanvasMode.Ready)
  const [selected, setSelected] = useState<string>("")
  const [pinned, setPinned] = useState<boolean>(true)
  const [pinnedPosition, setPinnedPosition] = useState<Position>({x:40, y:40})
  const [history, setHistory] = useState<Array<History>>(props.modelData?.history as History[])
  
  const getEdges = ():EdgeDisplayInstance[] => {
    return edges
  }

  if(props.modelData) { md = props.modelData.nodes}
  const [nodes, setNodes] = useState(md)

  if(props.modelData) { ed = props.modelData.edges}
  const [edges, setEdges] = useState(ed)

  if(props.modelData) { jd = props.modelData.junctions}
  const [junctions, setJunctions] = useState(jd)

  
  let edd:EdgeDisplayInstance = { id:"temp-edge", edgeData: { edgeId:'temp-edge', name:'temp-edge', sourceObject:'unknown', destinationObject:'unknown',  type: EdgeRelationships.Association, label:'temp-edge'}, isSelected: false, isVisible:false, sourceAnchor:'unknown', position:{x:0, y:0}, size:{height:0, width:0}, status:0, destinationAnchor:'unknown', route: [{x:-1,y:-1},{x:-1, y:-1}], style: {weight:"1", layout: EdgeLayout.Straight, color: 'silver', style:'1'  }, anchors:[]}
  const [newEdge, setNewEdge] = useState<EdgeDisplayInstance>(edd)

  const canvasController:CanvasController = new CanvasController(props.defaults, props.modelData as IModel, mode, setMode, dragData, setDragData, nodes, setNodes, edges, setEdges, junctions, setJunctions, newEdge, setNewEdge, selected, setSelected, pinned, setPinned, pinnedPosition, setPinnedPosition, history, setHistory)
  
  let nodeHandler:NodeHandler = new NodeHandler(canvasController)
  let nodeAnchorHandler:NodeAnchorHandler = new NodeAnchorHandler(canvasController)
  let edgeHandler:EdgeHandler = new EdgeHandler(canvasController)
  let edgeAnchorHandler:EdgeAnchorHandler = new EdgeAnchorHandler(canvasController)
  let edgeHandleHandler:EdgeHandleHandler = new EdgeHandleHandler(canvasController)
  let edgePropertyBoxHandler = new EdgePropertyBoxHandler(canvasController)
  let junctionHandler = new JunctionHandler(canvasController)

  const checkKeyPress = (e:KeyboardEvent) =>{
    e.stopImmediatePropagation()
    if(e.key === "Delete" || e.key === "Backspace") {
      var o = canvasController.selected.split(":")
      if(o[0]==="edge") {
        edgeHandler.remove(o[1])
      } else if(o[0] === "node") { 
        nodeHandler.remove(o[1])
      } else if(o[0] === "junction") {
        junctionHandler.remove(o[1])
      } 
    }
    else if(e.key === "Escape") {
      canvasController.setMode(CanvasMode.Ready)
      canvasController.clearSelect()
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", checkKeyPress);
    return () => {
      window.removeEventListener("keyup", checkKeyPress);
    };
  }, [checkKeyPress]);

  let backgroundMove = (e:React.MouseEvent<SVGElement>) => {
    let pos:Position = {x:0, y:0}
    pos.x = e.pageX
    pos.y = e.pageY
    const bbox = e.currentTarget.getBoundingClientRect()
    if(mode === CanvasMode.MoveNode) {
      nodeHandler.inMove(dragData.currentId, e.shiftKey, {x:e.pageX, y:e.pageY} )
    } else if(e.shiftKey && mode === CanvasMode.AddEdge) {
      edgeHandler.moveAddEdge(pos, bbox)
    } else if (mode === CanvasMode.MoveEdgeEndAnchor) {
      edgeHandler.moveEdgeEndPoint(pos, bbox)
    } else if(mode === CanvasMode.MoveJunction) {
      pos.x = e.pageX 
      pos.y = e.pageY 
      junctionHandler.move(dragData.currentId,  pos)
    } else if(mode === CanvasMode.MoveEdgeAnchor) {
      pos.x = e.pageX - dragData.offset.x
      pos.y = e.pageY - dragData.offset.y
      edgeAnchorHandler.moveAnchor(pos, bbox)
    } else if(mode===CanvasMode.MoveEdgeHandle) {
      edgeHandleHandler.moveHandlePosition(pos, bbox)
    } else if(mode===CanvasMode.MovePropertyBox) {
      edgePropertyBoxHandler.move("edge-property-box", {x:e.pageX - bbox.left, y:e.pageY - bbox.top})
    }
  }

  let backgroundMouseUp = (e:React.MouseEvent<SVGElement>) => {
    if(mode===CanvasMode.MoveEdgeAnchor  || mode === CanvasMode.MoveEdgeHandle) {
      canvasController.setCanvasMode(CanvasMode.Ready)
      setDragData({type:'none', currentId:'', offset:{x:-1, y:-1}, position:{x:-1, y: -1}})
      canvasController.clearSelect()
    } else if(mode === CanvasMode.AddEdge || mode === CanvasMode.MoveEdgeEndAnchor) {
      canvasController.setCanvasMode(CanvasMode.Ready)
      setNewEdge(edd)
    } else {
      canvasController.setCanvasMode(CanvasMode.Ready)
      setSelected("")
    }
  }

  let np:NodeParameters = {
    setHover: nodeHandler.setHover,
    clearHover: nodeHandler.clearHover,
    setSelected: nodeHandler.setSelected,
    startMove: nodeHandler.startMove,
    move: nodeHandler.move,
    inMove: nodeHandler.inMove,
    endMove: nodeHandler.endMove,
    addAnchor: nodeHandler.addAnchor,
    anchorParams: {
      setHover: nodeAnchorHandler.setHover,
      clearHover: nodeAnchorHandler.clearHover,
      setSelectedAnchor: nodeAnchorHandler.startNewEdge,
      setNewEdgeEndPoint: nodeAnchorHandler.endNewEdge,
    },
    inAddAnchor: nodeHandler.inAddAnchor,
    setReady: nodeHandler.setReady,
    index:0
  }
  
  let elNodes:Array<JSX.Element> = []
  let elEdges:Array<JSX.Element> = []
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
          elNodes.push(niac)
          break
        case NodeType.ApplicationCollaboration:
          let niacl:JSX.Element = new ApplicationCollaborationNode(n, np).Render()
          elNodes.push(niacl)
          break
        case NodeType.ApplicationInterface:
          let niain:JSX.Element = new ApplicationInterfaceNode(n,np).Render()
          elNodes.push(niain)
          break
        case NodeType.ApplicationFunction:
          let niaf:JSX.Element = new ApplicationFunctionNode(n, np).Render()
          elNodes.push(niaf)
          break
        case NodeType.ApplicationInteraction:
          let niaif:JSX.Element = new ApplicationInteractionNode(n, np).Render()
          elNodes.push(niaif)
          break
        case NodeType.ApplicationEvent:
          let niae:JSX.Element = new ApplicationEventNode(n, np).Render()
          elNodes.push(niae)
          break
        case NodeType.ApplicationProcess:
          let niap:JSX.Element = new ApplicationProcessNode(n, np).Render()
          elNodes.push(niap)
          break
        case NodeType.ApplicationService:
          let nias:JSX.Element = new ApplicationServiceNode(n, np).Render()
          elNodes.push(nias)
          break
        case NodeType.ApplicationDataObject:
          let niado:JSX.Element = new ApplicationDataObjectNode(n, np).Render()
          elNodes.push(niado)
          break
        case NodeType.BusinessActor:
          let niba:JSX.Element = new BusinessActorNode(n, np).Render()
          elNodes.push(niba)
          break
        case NodeType.BusinessRole:
          let nibr:JSX.Element = new BusinessRoleNode(n, np).Render()
          elNodes.push(nibr)
          break
        case NodeType.BusinessInterface:
          let nibi:JSX.Element = new BusinessInterfaceNode(n, np).Render()
          elNodes.push(nibi)
          break
        case NodeType.BusinessCollaboration:
          let nibc:JSX.Element = new BusinessCollaborationNode(n, np).Render()
          elNodes.push(nibc)
          break
        case NodeType.BusinessProcess:
          let nibp:JSX.Element = new BusinessProcessNode(n, np).Render()
          elNodes.push(nibp)
          break
        case NodeType.BusinessProduct:
          let nibpr:JSX.Element = new BusinessProductNode(n, np).Render()
          elNodes.push(nibpr)
          break
        case NodeType.BusinessFunction:
          let nibf:JSX.Element = new BusinessFunctionNode(n, np).Render()
          elNodes.push(nibf)
          break
        case NodeType.BusinessInteraction:
          let nibin:JSX.Element = new BusinessInteractionNode(n, np).Render()
          elNodes.push(nibin)
          break
        case NodeType.BusinessEvent:
          let nibe:JSX.Element = new BusinessEventNode(n, np).Render()
          elNodes.push(nibe)
          break
        case NodeType.BusinessService:
          let nibs:JSX.Element = new BusinessServiceNode(n, np).Render()
          elNodes.push(nibs)
          break
        case NodeType.BusinessObject:
          let nibo:JSX.Element = new BusinessObjectNode(n, np).Render()
          elNodes.push(nibo)
          break
        case NodeType.BusinessContract:
          let nibco:JSX.Element = new BusinessContractNode(n, np).Render()
          elNodes.push(nibco)
          break
        case NodeType.BusinessRepresentation:
          let nibrp:JSX.Element = new BusinessRepresentationNode(n, np).Render()
          elNodes.push(nibrp)
          break
        case NodeType.TechnologyArtifact:
          let nita:JSX.Element = new TechnologyArtifactNode(n, np).Render()
          elNodes.push(nita)
          break
        case NodeType.TechnologyCollaboration:
          let nitc:JSX.Element = new TechnologyCollaborationNode(n, np).Render()
          elNodes.push(nitc)
          break
        case NodeType.TechnologyCommunicationNetwork:
          let nitcn:JSX.Element = new TechnologyCommunicationNetworkNode(n, np).Render()
          elNodes.push(nitcn)
          break
        case NodeType.TechnologyDevice:
          let nitd:JSX.Element = new TechnologyDeviceNode(n, np).Render()
          elNodes.push(nitd)
          break
          case NodeType.TechnologyEvent:
          let nite:JSX.Element = new TechnologyEventNode(n, np).Render()
          elNodes.push(nite)
          break
        case NodeType.TechnologyFunction:
          let nitf:JSX.Element = new TechnologyFunctionNode(n, np).Render()
          elNodes.push(nitf)
          break
        case NodeType.TechnologyInteraction:
          let niti:JSX.Element = new TechnologyInteractionNode(n, np).Render()
          elNodes.push(niti)
          break
        case NodeType.TechnologyInterface:
          let nitif:JSX.Element = new TechnologyInterfaceNode(n, np).Render()
          elNodes.push(nitif)
          break
        case NodeType.TechnologyPath:
          let nitp:JSX.Element = new TechnologyPathNode(n, np).Render()
          elNodes.push(nitp)
          break
        case NodeType.TechnologyProcess:
          let nitpr:JSX.Element = new TechnologyProcessNode(n, np).Render()
          elNodes.push(nitpr)
          break
        case NodeType.TechnologyService:
          let nits:JSX.Element = new TechnologyServiceNode(n, np).Render()
          elNodes.push(nits)
          break
        case NodeType.TechnologySystemSoftware:
          let nitss:JSX.Element = new TechnologySystemSoftwareNode(n, np).Render()
          elNodes.push(nitss)
          break
        case NodeType.TechnologyNode:
          let nitn:JSX.Element = new TechnologyNodeNode(n, np).Render()
          elNodes.push(nitn)
          break
        case NodeType.TechnologyEquipment:
          let niteq:JSX.Element = new TechnologyEquipmentNode(n, np).Render()
          elNodes.push(niteq)
          break
        case NodeType.TechnologyFacility:
          let nitfa:JSX.Element = new TechnologyFacilityNode(n, np).Render()
          elNodes.push(nitfa)
          break
        case NodeType.TechnologyDistributionNetwork:
          let nitdn:JSX.Element = new TechnologyDistributionNetworkNode(n, np).Render()
          elNodes.push(nitdn)
          break
        case NodeType.TechnologyMaterial:
          let nitm:JSX.Element = new TechnologyMaterialNode(n, np).Render()
          elNodes.push(nitm)
          break
        case NodeType.MotivationAssesment:
          let nima:JSX.Element = new MotivationAssessmentNode(n, np).Render()
          elNodes.push(nima)
          break
        case NodeType.MotivationConstraint:
          let nimc:JSX.Element = new MotivationConstraintNode(n, np).Render()
          elNodes.push(nimc)
          break
        case NodeType.MotivationDriver:
          let nimd:JSX.Element = new MotivationDriverNode(n, np).Render()
          elNodes.push(nimd)
          break
        case NodeType.MotivationGoal:
          let nimg:JSX.Element = new MotivationGoalNode(n, np).Render()
          elNodes.push(nimg)
          break
        case NodeType.MotivationMeaning:
          let nimm:JSX.Element = new MotivationMeaningNode(n, np).Render()
          elNodes.push(nimm)
          break
        case NodeType.MotivationOutcome:
          let nimo:JSX.Element = new MotivationOutcomeNode(n, np).Render()
          elNodes.push(nimo)
          break
        case NodeType.MotivationPrinciple:
          let nimp:JSX.Element = new MotivationPrincipleNode(n, np).Render()
          elNodes.push(nimp)
          break
        case NodeType.MotivationRequirement:
          let nimr:JSX.Element = new MotivationRequirementNode(n, np).Render()
          elNodes.push(nimr)
          break
        case NodeType.MotivationStakeholder:
          let nims:JSX.Element = new MotivationStakeholderNode(n, np).Render()
          elNodes.push(nims)
          break
        case NodeType.MotivationValue:
          let nimv:JSX.Element = new MotivationValueNode(n, np).Render()
          elNodes.push(nimv)
          break
        case NodeType.StrategyResource:
          let nisr:JSX.Element = new StrategyResourceNode(n, np).Render()
          elNodes.push(nisr)
          break
        case NodeType.StrategyCapability:
          let nisc:JSX.Element = new StrategyCapabilityNode(n, np).Render()
          elNodes.push(nisc)
          break
        case NodeType.StrategyValueStream:
          let nisvs:JSX.Element = new StrategyValueStreamNode(n, np).Render()
          elNodes.push(nisvs)
          break
        case NodeType.StrategyCourseOfAction:
          let niscoa:JSX.Element = new StrategyCourseOfActionNode(n, np).Render()
          elNodes.push(niscoa)
          break
        default:
          let ni:JSX.Element = new BaseNode(n, np).Render()
          elNodes.push(ni)
      }
    }
  })

  let ep:EdgeParameters = {
    index:200,
    setHover: edgeHandler.setHover,
    setSelectedEdge: edgeHandler.setSelectedEdge,
    clearHover: edgeHandler.clearHover,
    dragDone: edgeHandler.dragDone,
    anchorParams: {
      selectAnchor: edgeAnchorHandler.selectAnchor,
      moveAnchor: edgeAnchorHandler.moveAnchor,
      dropAnchor: edgeAnchorHandler.dropAnchor
    },
    handleParams: {
      setSelectedHandle: edgeHandleHandler.setSelectedHandle,
      moveHandle: edgeHandleHandler.moveHandle, 
      endMoveHandle: edgeHandleHandler.endMoveHandle
    },
  }

  edges.forEach((e, i) => {
    if(e.isVisible) {
      e.route = helpers.getAdjustedRoute(nodes, junctions, e, dragData.currentId)
      let ei:JSX.Element = new BaseEdge(e, ep).Render()
      elEdges.push(ei)
    }
  })

  const jp:JunctionParameters = {
    setHover: junctionHandler.setHover,
    clearHover: junctionHandler.clearHover,
    setSelected: junctionHandler.setSelected,
    move: junctionHandler.move,
    drop: junctionHandler.drop,
    dropOnAnchor: junctionHandler.endNewEdge,
    clickOnAnchor: junctionHandler.startNewEdge
  }
  
  junctions.forEach((e) => {
    let ei:JSX.Element = new Junction(e, jp).Render()
    elNodes.push(ei)
  })

  let propertyBox = <span></span>

  if(selected.length > 0 ) {
    let t = selected.split(":")[0]
    let id = selected.split(":")[1]

    if(t === "edge") {
      let curEdge = edges.find((ed) => { return ed.id === id}) as EdgeDisplayInstance
      
      if(curEdge) {
        let ex = helpers.getExtents(curEdge.route)
        let  params:EdgePropertyBoxProps = {
          id:id as string,
          data:curEdge?.edgeData as Edge,
          dataRenderer: EdgeDataRenderer,
          dragStart: edgePropertyBoxHandler.dragStart,
          dragDone: edgePropertyBoxHandler.dragDone,
          setEdgeLayout: edgePropertyBoxHandler.setEdgeLayout,
          setEdgeType: edgePropertyBoxHandler.setEdgeType,
          move: edgePropertyBoxHandler.move,
          remove: edgePropertyBoxHandler.remove,
          pinned: pinned,
          togglePin: edgePropertyBoxHandler.togglePin,
          position: pinned ? pinnedPosition :  {x:ex.bottomright.x + 30, y:ex.topleft.y }
        }
    
        propertyBox = <EdgePropertyBox {...params} />
      }
    }
  }

  cvsW = cvsW + 100
  cvsH = cvsH + 100

  let ne:EdgeDisplayInstance = newEdge
  const newEdgeEl = new BaseEdge(ne, ep).Render()

  return <div className="canvas" style={{"height": "" + cvsH + "px" , "width": +"" + cvsW + "px" }}>
    <svg id="canvas" version="2.0" height={cvsH} width={cvsW} >
      <rect x="0" y="0" width={cvsW} height={cvsH} fill="#efffff" onClick={canvasController.clearSelect} onMouseMove={backgroundMove} onMouseUp={backgroundMouseUp}/>
      <g id="node-layer">{ elNodes }</g>
      <g id="edge-layer">{ elEdges }</g>
      <span id="top"></span>
      { newEdgeEl }
    </svg>
    { propertyBox }
    <span className='debug-data'>{helpers.getEnumName(CanvasMode, mode) + ", " + selected}</span>
  </div>
}