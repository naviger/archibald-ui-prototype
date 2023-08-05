import React, {useState} from "react"
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
import { EdgeRelationshipTypes, EdgeRelationships } from "../enums/enumEdgeRelationships"
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

  if(props.modelData) { md = props.modelData.nodes}
  const [nodes, setNodes] = useState(md)

  if(props.modelData) { ed = props.modelData.edges}
  const [edges, setEdges] = useState(ed)

  if(props.modelData) { jd = props.modelData.junctions}
  const [junctions, setJunctions] = useState(jd)

  let edd:EdgeDisplayInstance = { id:"temp", edgeData: { edgeId:'temp', name:'temp', sourceObject:'unknown', destinationObject:'unknown',  type: EdgeRelationships.Association, label:'temp'}, isSelected: false, isVisible:false, sourceAnchor:'unknown', position:{x:0, y:0}, size:{height:0, width:0}, status:0, destinationAnchor:'unknown', route: [{x:-1,y:-1},{x:-1, y:-1}], style: {weight:"1", layout: EdgeLayout.Straight, color: 'silver', style:'1'  }, anchors:[]}
  const [newEdge, setNewEdge] = useState<EdgeDisplayInstance>(edd)

  const canvasController:CanvasController = new CanvasController(props.defaults,mode, setMode, dragData, setDragData, nodes, setNodes, edges, setEdges, junctions, setJunctions, newEdge, setNewEdge, setSelected)
  
  let nodeHandler:NodeHandler = new NodeHandler(canvasController)
  let nodeAnchorHandler:NodeAnchorHandler = new NodeAnchorHandler(canvasController)
  let edgeHandler:EdgeHandler = new EdgeHandler(canvasController)
  let edgeAnchorHandler:EdgeAnchorHandler = new EdgeAnchorHandler(canvasController)
  let edgeHandleHandler:EdgeHandleHandler = new EdgeHandleHandler(canvasController)
  let edgePropertyBoxHandler = new EdgePropertyBoxHandler(canvasController)
  let junctionHandler = new JunctionHandler(canvasController)

  let backgroundMove = (e:React.MouseEvent<SVGElement>) => {
    let pos:Position = {x:0, y:0}
    pos.x = e.clientX
    pos.y = e.clientY
    const bbox = e.currentTarget.getBoundingClientRect()
    if(e.shiftKey && mode === CanvasMode.AddEdge) {
      edgeHandler.addEdge(pos, bbox)
    } else if(mode===CanvasMode.MoveJunction) {
      pos.x = e.pageX 
      pos.y = e.pageY 
      junctionHandler.move(dragData.currentId,  pos)
    } else if(mode===CanvasMode.MoveEdgeAnchor) {
      pos.x = e.pageX - dragData.offset.x
      pos.y = e.pageY - dragData.offset.y
      edgeAnchorHandler.moveAnchor(pos, bbox)
    } else if(mode===CanvasMode.MoveEdgeHandle) {
      edgeHandleHandler.moveHandlePosition(pos, bbox)
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
      canvasController.clearPointerEvents()
      setDragData({type:'none', currentId:'', offset:{x:-1, y:-1}, position:{x:-1, y: -1}})
      canvasController.clearSelect()
    } else if(mode === CanvasMode.AddEdge) {
      setMode(CanvasMode.Ready)
      setNewEdge(edd)
    } else {
      setSelected("")
    }
  }

  let np:NodeParameters = {
    canvasMode:mode,
    setHover: nodeHandler.setHover,
    clearHover: nodeHandler.clearHover,
    setSelected: nodeHandler.setSelected,
    startMove: nodeHandler.startMove,
    inMove: nodeHandler.inMove,
    endMove: nodeHandler.endMove,
    addAnchor: nodeHandler.addAnchor,
    anchorParams: {
      setHover: nodeAnchorHandler.setHover,
      clearHover: nodeAnchorHandler.clearHover,
      setSelectedAnchor: nodeAnchorHandler.startNewEdge,
      setNewEdgeEndPoint: nodeAnchorHandler.endNewEdge,
      dragNewEdge:  nodeAnchorHandler.dragNewEdge
    },
    inAddAnchor: nodeHandler.inAddAnchor,
    setReady: nodeHandler.setReady,
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

  edges.forEach((e) => {
    if(e.isVisible) {
      const src:NodeDisplayInstance|undefined = nodes.find((n)=>{ return n.id == e.edgeData.sourceObject})
      const dst:NodeDisplayInstance|undefined = nodes.find((n)=>{ return n.id == e.edgeData.destinationObject})
      e.route = helpers.getAdjustedRoute(nodes, junctions, e, dragData.currentId)
      let ei:JSX.Element = new BaseEdge(e, ep).Render()
      els.push(ei)
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
    els.push(ei)
  })

  let propertyBox = <span></span>

  if(selected.length > 0 ) {
    let t = selected.split(":")[0]
    let id = selected.split(":")[1]

    if(t === "edge") {
      let curEdge = edges.find((ed) => { return ed.id === id}) as EdgeDisplayInstance
      if(curEdge) {
        let  params:EdgePropertyBoxProps = {
          id:id as string,
          data:curEdge?.edgeData as Edge,
          dataRenderer: EdgeDataRenderer,
          dragStart: edgePropertyBoxHandler.dragStart,
          dragDone: edgePropertyBoxHandler.dragDone,
          setEdgeLayout: edgePropertyBoxHandler.setEdgeLayout,
          setEdgeType: edgePropertyBoxHandler.setEdgeType,
          remove: edgePropertyBoxHandler.remove,
          position:{x:curEdge?.route[0].x + 30, y:curEdge.route[0].y + 30 }
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
      { els }
      { newEdgeEl }
    </svg>
    { propertyBox }
    <span className='debug-data'>{helpers.getEnumName(CanvasMode, mode) }</span>
  </div>
}