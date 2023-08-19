import { Edge, EdgeDisplayInstance } from "../structure/Edge"
import { IModel } from "../structure/Model"
import { Node, NodeDisplayInstance} from "../structure/Node"
import { Entity } from "../structure/Entity"
import { History } from "../structure/History"
import { NodeType } from "../enums/enumNodeType"
import { AnchorStatus } from "../enums/enumAnchorStatus"
import { EdgeLayout } from "../enums/enumEdgeLayout"
import { EdgeRelationships } from "../enums/enumEdgeRelationships"
import { NodeFamily } from "../enums/enumNodeFamily"
import { Position } from "../structure/Position"
import { IpcNetConnectOpts } from "net"
import { EdgeDirection } from "../enums/enumEdgeDirection"
import { NodeStatus } from "../enums/enumNodeStatus"
import { JunctionDisplayInstance } from "../structure/Junction"
import { JunctionType } from "../enums/enumJunctionType"
import { FlowDirection } from "../enums/enumFlowDirection"
import { HistoryActionType } from "../enums/enumHistoryType"

export const GetTestData = ():IModel => {
  let n1:NodeDisplayInstance = {
    id:'n1-1',
    nodeData: { nodeId: 'node-1', name: "Application:Component", type: NodeType.ApplicationComponent, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 50, y: 200 },
    size: {height: 100, width: 180}, 
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Occupied, edges:["e1-1"]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  };
  let n2:NodeDisplayInstance = {
    id:'n2-1',
    nodeData: { nodeId: 'node-2', name: "Application:Collaboration", type: NodeType.ApplicationCollaboration, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 150, y: 400 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Occupied, edges:["e1-1"]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n3:NodeDisplayInstance = {
    id:'n3-1',
    nodeData: { nodeId: 'node-3', name: "Business:Interface", type: NodeType.BusinessInterface, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 550 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n4:NodeDisplayInstance = {
    id:'n4-1',
    nodeData: { nodeId: 'node-4', name: "Business:Actor", type: NodeType.BusinessActor, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 550 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n5:NodeDisplayInstance = {
    id:'n5-1',
    nodeData: { nodeId: 'node-5', name: "Business:Role", type: NodeType.BusinessRole, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 650, y: 550 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n6:NodeDisplayInstance = {
    id:'n6-1',
    nodeData: { nodeId: 'node-6', name: "Business:Collaboration", type: NodeType.BusinessCollaboration, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 850, y: 550 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n7:NodeDisplayInstance = {
    id:'n7-1',
    nodeData: { nodeId: 'node-7', name: "Business:Process", type: NodeType.BusinessProcess, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 50, y: 700 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n8:NodeDisplayInstance = {
    id:'n8-1',
    nodeData: { nodeId: 'node-8', name: "Business:Function", type: NodeType.BusinessFunction, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 700 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n9:NodeDisplayInstance = {
    id:'n9-1',
    nodeData: { nodeId: 'node-9', name: "Business:Interaction", type: NodeType.BusinessInteraction, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 700 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n10:NodeDisplayInstance = {
    id:'n10-1',
    nodeData: { nodeId: 'node-10', name: "Business:Event", type: NodeType.BusinessEvent, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 650, y: 700 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n11:NodeDisplayInstance = {
    id:'n11-1',
    nodeData: { nodeId: 'node-11', name: "Business:Service", type: NodeType.BusinessService, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 850, y: 700 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n12:NodeDisplayInstance = {
    id:'n12-1',
    nodeData: { nodeId: 'node-12', name: "Business:Object", type: NodeType.BusinessObject, family: NodeFamily.PassiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 50, y: 850 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n13:NodeDisplayInstance = {
    id:'n13-1',
    nodeData: { nodeId: 'node-13', name: "Business:Contract", type: NodeType.BusinessContract, family: NodeFamily.PassiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 850 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n14:NodeDisplayInstance = {
    id:'n14-1',
    nodeData: { nodeId: 'node-14', name: "Business:Representation", type: NodeType.BusinessRepresentation, family: NodeFamily.PassiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 850 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n14a:NodeDisplayInstance = {
    id:'n14a-1',
    nodeData: { nodeId: 'node-14a', name: "Business:Product", type: NodeType.BusinessProduct, family: NodeFamily.CompositeElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 650, y: 850 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n15:NodeDisplayInstance = {
    id:'n15-1',
    nodeData: { nodeId: 'node-15', name: "Application:Interface", type: NodeType.ApplicationInterface, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 200 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }
  
  let n16:NodeDisplayInstance = {
    id:'n16-1',
    nodeData: { nodeId: 'node-16', name: "Application:Function", type: NodeType.ApplicationFunction, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 50, y: 50 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n17:NodeDisplayInstance = {
    id:'n17-1',
    nodeData: { nodeId: 'node-17', name: "Application:Interaction", type: NodeType.ApplicationInteraction, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 50 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n18:NodeDisplayInstance = {
    id:'n18-1',
    nodeData: { nodeId: 'node-18', name: "Application:Process", type: NodeType.ApplicationProcess, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 50 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n19:NodeDisplayInstance = {
    id:'n19-1',
    nodeData: { nodeId: 'node-19', name: "Application:Event", type: NodeType.ApplicationEvent, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 650, y: 50 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n20:NodeDisplayInstance = {
    id:'n20-1',
    nodeData: { nodeId: 'node-20', name: "Application:Service", type: NodeType.ApplicationService, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 850, y: 50 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let n21:NodeDisplayInstance = {
    id:'n21-1',
    nodeData: { nodeId: 'node-21', name: "Application:DataObject", type: NodeType.ApplicationDataObject, family: NodeFamily.PassiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 200 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt1:NodeDisplayInstance = {
    id:'nt1-1',
    nodeData: { nodeId: 'node-t1', name: "Technology:Artifact", type: NodeType.TechnologyArtifact, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 50, y: 1000 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt2:NodeDisplayInstance = {
    id:'nt2-1',
    nodeData: { nodeId: 'node-t2', name: "Technology:Node", type: NodeType.TechnologyNode, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 1000 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt3:NodeDisplayInstance = {
    id:'nt3-1',
    nodeData: { nodeId: 'node-t3', name: "Technology: Communication Network", type: NodeType.TechnologyCommunicationNetwork, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 1000 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt4:NodeDisplayInstance = {
    id:'nt4-1',
    nodeData: { nodeId: 'node-t4', name: "Technology:Device", type: NodeType.TechnologyDevice, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 650, y: 1000 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt5:NodeDisplayInstance = {
    id:'nt5-1',
    nodeData: { nodeId: 'node-t5', name: "Technology:System Software", type: NodeType.TechnologySystemSoftware, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 850, y: 1000 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt6:NodeDisplayInstance = {
    id:'nt6-1',
    nodeData: { nodeId: 'node-t6', name: "Technology:Collaboration", type: NodeType.TechnologyCollaboration, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1050, y: 1000 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt7:NodeDisplayInstance = {
    id:'nt7-1',
    nodeData: { nodeId: 'node-t7', name: "Technology:Interface", type: NodeType.TechnologyInterface, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1250, y: 1000 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt8:NodeDisplayInstance = {
    id:'nt8-1',
    nodeData: { nodeId: 'node-t8', name: "Technology:Path", type: NodeType.TechnologyPath, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1450, y: 1000 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:['e2-1']}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt9:NodeDisplayInstance = {
    id:'nt9-1',
    nodeData: { nodeId: 'node-t9', name: "Technology:Function", type: NodeType.TechnologyFunction, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 50, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt10:NodeDisplayInstance = {
    id:'nt10-1',
    nodeData: { nodeId: 'node-t10', name: "Technology:Process", type: NodeType.TechnologyProcess, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt11:NodeDisplayInstance = {
    id:'nt11-1',
    nodeData: { nodeId: 'node-t11', name: "Technology:Interaction", type: NodeType.TechnologyInteraction, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt12:NodeDisplayInstance = {
    id:'nt12-1',
    nodeData: { nodeId: 'node-t12', name: "Technology:Event", type: NodeType.TechnologyEvent, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 650, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt13:NodeDisplayInstance = {
    id:'nt13-1',
    nodeData: { nodeId: 'node-t13', name: "Technology:Node", type: NodeType.TechnologyService, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 850, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt14:NodeDisplayInstance = {
    id:'nt14-1',
    nodeData: { nodeId: 'node-t14', name: "Technology:Equipment", type: NodeType.TechnologyEquipment, family: NodeFamily.PhysicalStructureNode, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1050, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt15:NodeDisplayInstance = {
    id:'nt15-1',
    nodeData: { nodeId: 'node-t15', name: "Technology:Facility", type: NodeType.TechnologyFacility, family: NodeFamily.PhysicalStructureNode, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1250, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt16:NodeDisplayInstance = {
    id:'nt16-1',
    nodeData: { nodeId: 'node-t16', name: "Technology:Distribution Network", type: NodeType.TechnologyDistributionNetwork, family: NodeFamily.PhysicalStructureNode, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1450, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nt17:NodeDisplayInstance = {
    id:'nt17-1',
    nodeData: { nodeId: 'node-t17', name: "Technology:Material>", type: NodeType.TechnologyMaterial, family: NodeFamily.PhysicalStructureNode, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1650, y: 1150 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm1:NodeDisplayInstance = {
    id:'nm1-1',
    nodeData: { nodeId: 'node-m1', name: "Motivation:Stakeholder", type: NodeType.MotivationStakeholder, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 50, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm2:NodeDisplayInstance = {
    id:'nm2-1', nodeData: { nodeId: 'node-m2', name: "Motivation:Driver", type: NodeType.MotivationDriver, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm3:NodeDisplayInstance = {
    id:'nm3-1', nodeData: { nodeId: 'node-m3', name: "Motivation:Assesment", type: NodeType.MotivationAssesment, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm4:NodeDisplayInstance = {
    id:'nm4-1', nodeData: { nodeId: 'node-m4', name: "Motivation:Goal", type: NodeType.MotivationGoal, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 650, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm5:NodeDisplayInstance = {
    id:'nm5-1', nodeData: { nodeId: 'node-m5', name: "Motivation:Outcome", type: NodeType.MotivationOutcome, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 850, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm6:NodeDisplayInstance = {
    id:'nm6-1', nodeData: { nodeId: 'node-m6', name: "Motivation:Principle", type: NodeType.MotivationPrinciple, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1050, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm7:NodeDisplayInstance = {
    id:'nm7-1', nodeData: { nodeId: 'node-m7', name: "Motivation:Requirement", type: NodeType.MotivationRequirement, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1250, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm8:NodeDisplayInstance = {
    id:'nm8-1', nodeData: { nodeId: 'node-m8', name: "Motivation:Constraint", type: NodeType.MotivationConstraint, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1450, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm9:NodeDisplayInstance = {
    id:'nm9-1', nodeData: { nodeId: 'node-m9', name: "Motivation:Meaning", type: NodeType.MotivationMeaning, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1650, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let nm10:NodeDisplayInstance = {
    id:'nm10-1', nodeData: { nodeId: 'node-m10', name: "Motivation:Value", type: NodeType.MotivationValue, family: NodeFamily.MotivationElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 1850, y: 1300 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let ns1:NodeDisplayInstance = {
    id:'ns1-1', nodeData: { nodeId: 'node-s1', name: "Strategy:Resource", type: NodeType.StrategyResource, family: NodeFamily.ActiveStructureElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 50, y: 1450 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let ns2:NodeDisplayInstance = {
    id:'ns2-1', nodeData: { nodeId: 'node-s2', name: "Strategy:Capability", type: NodeType.StrategyCapability, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 250, y: 1450 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let ns3:NodeDisplayInstance = {
    id:'ns3-1', nodeData: { nodeId: 'node-s3', name: "Strategy:ValueStream", type: NodeType.StrategyValueStream, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 450, y: 1450 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let ns4:NodeDisplayInstance = {
    id:'ns4-1', nodeData: { nodeId: 'node-s4', name: "Strategy:CourseOfAction", type: NodeType.StrategyCourseOfAction, family: NodeFamily.BehaviorElement, data: {}, dimensions: {height:100, width:180} },
    position: {x: 650, y: 1450 },
    size: {height: 100, width: 180},
    annotation:'',
    isSelected:false,
    isVisible:true,
    status: NodeStatus.Ready,
    anchors: [
      {id: 's1', position: {x: 0, y:0 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's2', position: {x: 90, y:0 }, status: AnchorStatus.Available, edges:['e2-1']}, 
      {id: 's3', position: {x: 180, y:0 }, status: AnchorStatus.Available, edges:[]},
      {id: 's4', position: {x: 0, y:50 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's5', position: {x: 180, y:50 }, status: AnchorStatus.Available, edges:[]},
      {id: 's6', position: {x: 0, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's7', position: {x: 90, y:100 }, status: AnchorStatus.Available, edges:[]}, 
      {id: 's8', position: {x: 180, y:100 }, status: AnchorStatus.Available, edges:[]}
    ]
  }

  let s:Position = { x: 390, y: 400 }
  let e:Position = { x: 190, y: 300 }

  let e1:EdgeDisplayInstance = {
    id: crypto.randomUUID(),
    edgeData: { edgeId: 'e1', name: 'edge-1', sourceObject:'n2-1', destinationObject:'n1-1', label:'', type: EdgeRelationships.Aggregation },
    sourceAnchor:'s2', 
    destinationAnchor:'s7',
    route:[ s, e ],
    isSelected:false,
    style: {
      weight: "1",
      color: "black",
      style: "3 1",
      layout: EdgeLayout.Straight,
    },
    isVisible: true,
    anchors:[],
    size: {height:0, width:0},
    position:{x:0, y:0},
    status:0
  }

  let e2:EdgeDisplayInstance = {
    id: crypto.randomUUID(),
    edgeData: { edgeId: 'e2', name:'edge-2', sourceObject: 'nt8-1', destinationObject:'ns4-1',  label:'Edge 2', type: EdgeRelationships.Flow},
    isSelected:false,
    sourceAnchor: 's7', 
    destinationAnchor:'s2',
    route: [ 
      {x: 1540, y: 1100 }, 
      {x: 1540, y:1120 }, 
      {x:740, y: 1120 }, 
      {x:740, y:1450 }
    ],
    style: {
      weight: "1",
      color: "green",
      style: "3 1",
      layout: EdgeLayout.NinetyDegree,
    },
    isVisible:true,
    anchors:[],
    size: {height:0, width:0},
    position:{x:0, y:0},
    status:0
  }


  let e3:EdgeDisplayInstance = {
    id: crypto.randomUUID(),
    edgeData: { edgeId: 'e3', name:'edge-3', sourceObject: 'nm4-1', destinationObject:'ns3-1', label:'Edge 2', type: EdgeRelationships.Flow},
    isSelected:false,
    sourceAnchor: 's7', 
    destinationAnchor:'s2', 
    route: [ 
      {x: 740, y: 1400 },
      {x: 450, y: 1450 }
    ],
    style: {
      weight: "1",
      color: "green",
      style: "3 1",
      layout: EdgeLayout.Straight
    },
    isVisible:true,
    anchors:[],
    size: {height:0, width:0},
    position:{x:0, y:0},
    status:0
  }

  let e4:EdgeDisplayInstance = {
    id: crypto.randomUUID(),
    edgeData: { edgeId: 'e4', name:'edge-4', sourceObject: 'nt6-1', destinationObject:'nt13-1', label:'Edge 2', type: EdgeRelationships.Flow},
    isSelected:false,
    sourceAnchor: 's7', 
    destinationAnchor:'s5', 
    route: [ 
      {x: 1140, y: 1100 },
      {x: 1140, y: 1200 },
      {x: 1030, y: 1200 }
    ],
    style: {
      weight: "1",
      color: "green",
      style: "3 1",
      layout: EdgeLayout.NinetyDegree
    },
    isVisible:true,
    anchors:[],
    size: {height:0, width:0},
    position:{x:0, y:0},
    status:0
  }

  let e5:EdgeDisplayInstance = {
    id: crypto.randomUUID(),
    edgeData: { edgeId: 'e5', name:'edge-5', sourceObject: 'n21-1', destinationObject:'n6-1', label:'Edge 5', type: EdgeRelationships.Composition},
    isSelected:false,
    sourceAnchor: 's7', 
    destinationAnchor:'s4', 
    route: [ 
      {x: 540, y: 300 },
      {x: 540, y: 600 },
      {x: 850, y: 600 }
    ],
    style: {
      weight: "1",
      color: "green",
      style: "3 1",
      layout: EdgeLayout.NinetyDegree
    },
    isVisible:true,
    anchors:[],
    size: {height:0, width:0},
    position:{x:0, y:0},
    status:0
  }

  let e6:EdgeDisplayInstance = {
    id: crypto.randomUUID(),
    edgeData: { edgeId: 'e6', name:'edge-6', sourceObject: 'nt4-1', destinationObject:'n13-1',  label:'Edge 6', type: EdgeRelationships.Aggregation},
    isSelected:false,
    sourceAnchor: 's2', 
    destinationAnchor:'s5',
    route: [ 
      {x: 740, y: 1000 },
      {x: 740, y: 900 },
      {x: 250+180, y: 850 + 50 }
    ],
    style: {
      weight: "1",
      color: "green",
      style: "3 1",
      layout: EdgeLayout.NinetyDegree
    },
    isVisible:true,
    anchors:[],
    size: {height:0, width:0},
    position:{x:0, y:0},
    status:0
  }

  let e7:EdgeDisplayInstance = {
    id: crypto.randomUUID(),
    edgeData: { edgeId: 'e7', name:'edge-7', sourceObject: 'n6-1', destinationObject:'n11-1',  label:'Edge 7', type: EdgeRelationships.Flow},
    isSelected:false,
    sourceAnchor: 's2', 
    destinationAnchor:'s7',
    route: [ 
      {x: 940, y: 550 },
      {x: 940, y: 530 },
      {x: 1050, y: 530 },
      {x: 1050, y: 820 },
      {x: 940, y: 820 },
      {x: 940, y: 800 }
    ],
    style: {
      weight: "1",
      color: "green",
      style: "3 1",
      layout: EdgeLayout.Rounded
    },
    isVisible:true,
    anchors:[],
    size: {height:0, width:0},
    position:{x:0, y:0},
    status:0
  }

  //M CP1 EP1 CP2 "S" EP2 CP3
  let e8:EdgeDisplayInstance = {
    id: crypto.randomUUID(),
    edgeData: { edgeId: 'e8', name:'edge-8', sourceObject: 'nt7-1', destinationObject:'nm6-1',label:'Edge 7', type: EdgeRelationships.Composition},
    isSelected:false,
    sourceAnchor: 's7', 
    destinationAnchor:'s2', 
    route: [ 
      {x: 1340, y: 1100},  //M
      {x: 1340, y: 1200 }, //HP1
      {x: 1340, y: 1230 }, //HP2
      {x: 1270, y: 1200 }, //EP2
      {x: 1115, y: 1255 }, //HP3
      {x: 1140, y: 1300 }, //EP3
    ],
    style: {
      weight: "1",
      color: "green",
      style: "3 1",
      layout: EdgeLayout.Bezier
    },
    isVisible:true,
    anchors:[],
    size: {height:0, width:0},
    position:{x:0, y:0},
    status:0
  }

  let j1:JunctionDisplayInstance =  {
    id: "j1",
    type: JunctionType.And,
    position: {x: 1000, y:400},
    isSelected: false,
    anchors: [
      {id: 'st', position: {x: 0, y:-10 }, flow: FlowDirection.In, status:AnchorStatus.Open, edges:[]}, 
      {id: 'sr', position: {x: 10, y:0 }, flow: FlowDirection.Out, status: AnchorStatus.Open, edges:[]}, 
      {id: 'sb', position: {x: 0, y:10 }, flow: FlowDirection.Out, status: AnchorStatus.Open, edges:[]},
      {id: 'sl', position: {x: -10, y:0 }, flow: FlowDirection.In, status: AnchorStatus.Open, edges:[]}
    ],
    showAnchors: false,
    size: {height:20, width:20},
    isVisible:false,
    status:0
  }

  let j2:JunctionDisplayInstance = {
    id: "j2",
    type: JunctionType.Or,
    position: {x: 1100, y:600},
    isSelected: false,
    anchors: [
      {id: 'st', position: {x: 0, y:-10 }, flow: FlowDirection.In, status:AnchorStatus.Open, edges:[]}, 
      {id: 'sr', position: {x: 10, y:0 }, flow: FlowDirection.Out, status: AnchorStatus.Open, edges:[]}, 
      {id: 'sb', position: {x: 0, y:10 }, flow: FlowDirection.Out, status: AnchorStatus.Open, edges:[]},
      {id: 'sl', position: {x: -10, y:0 }, flow: FlowDirection.In, status: AnchorStatus.Open, edges:[]}
    ],
    showAnchors: false,
    size: {height:20, width:20},
    isVisible:false,
    status:0
  }

  let o:Entity = { type: 'company', name: 'Naviger', identifier:'naviger', contact: [ {type: 'email', value:'info@naviger.com', notes: 'n/a'}] }
  let m:IModel = {
    name: 'Model 1',
    version: { major:0, minor:0, patch:0 },
    edges: [],
    nodes: [],
    junctions: [],
    Owner: o,
    description: 'test data',
    history: [ ]
  };

  m.nodes.push(n1)
  m.nodes.push(n2)
  m.nodes.push(n3)
  m.nodes.push(n4)
  m.nodes.push(n5)
  m.nodes.push(n6)
  m.nodes.push(n7)
  m.nodes.push(n8)
  m.nodes.push(n9)
  m.nodes.push(n10)
  m.nodes.push(n11)
  m.nodes.push(n12)
  m.nodes.push(n13)
  m.nodes.push(n14)
  m.nodes.push(n14a)
  m.nodes.push(n15)
  m.nodes.push(n16)
  m.nodes.push(n17)
  m.nodes.push(n18)
  m.nodes.push(n19)
  m.nodes.push(n20)
  m.nodes.push(n21)
  m.nodes.push(nt1)
  m.nodes.push(nt2)
  m.nodes.push(nt3)
  m.nodes.push(nt4)
  m.nodes.push(nt5)
  m.nodes.push(nt6)
  m.nodes.push(nt7)
  m.nodes.push(nt8)
  m.nodes.push(nt9)
  m.nodes.push(nt10)
  m.nodes.push(nt11)
  m.nodes.push(nt12)
  m.nodes.push(nt13)
  m.nodes.push(nt14)
  m.nodes.push(nt15)
  m.nodes.push(nt16)
  m.nodes.push(nt17)
  m.nodes.push(nm1)
  m.nodes.push(nm2)
  m.nodes.push(nm3)
  m.nodes.push(nm4)
  m.nodes.push(nm5)
  m.nodes.push(nm6)
  m.nodes.push(nm7)
  m.nodes.push(nm8)
  m.nodes.push(nm9)
  m.nodes.push(nm10)
  m.nodes.push(ns1)
  m.nodes.push(ns2)
  m.nodes.push(ns3)
  m.nodes.push(ns4)
  
  m.edges.push(e1)
  m.edges.push(e2)
  m.edges.push(e3)
  m.edges.push(e4)
  m.edges.push(e5)
  m.edges.push(e6)
  m.edges.push(e7)
  m.edges.push(e8)

  m.junctions.push(j1)
  m.junctions.push(j2)

  let dt:Date = new Date
  let correlation:string = crypto.randomUUID()
  
  m.nodes.forEach((n) => {
    let nd:any = structuredClone(n)
    nd["nodeRef"] = nd.nodeData.nodeId
    let ni:Node = n.nodeData
    delete nd.nodeData
    
    m.history.push({
      correlation: correlation,
      modifiedDate: dt,
      type: HistoryActionType.create,
      objectType: "Node",
      modifiedBy:o,
      description: "Create Node: " + ni.nodeId,
      data: ni
    })

    m.history.push({
      correlation: correlation,
      modifiedDate: dt,
      type: HistoryActionType.create,
      objectType: "NodeDisplayInstance",
      modifiedBy:o,
      description: "Create Node Display Instance: " + n.id,
      data: nd
    })
  })

  m.junctions.forEach((j) => {
    let nd:any = structuredClone(j)
    
    m.history.push({
      correlation: correlation,
      modifiedDate: dt,
      type: HistoryActionType.create,
      objectType: "Junction",
      modifiedBy:o,
      description: "Create Junction: " + j.id,
      data: j
    })
  })

  m.edges.forEach((e) => {
    let ed:any = structuredClone(e)
    ed["edgeRef"] = e.edgeData.edgeId
    let ei:Edge = e.edgeData
    delete ed.edgeData
    
    m.history.push({
      correlation: correlation,
      modifiedDate: dt,
      type: HistoryActionType.create,
      objectType: "Edge",
      modifiedBy:o,
      description: "Create Edge: " + ei.edgeId,
      data: ei
    })

    m.history.push({
      correlation: correlation,
      modifiedDate: dt,
      type: HistoryActionType.create,
      objectType: "EdgeDisplayInstance",
      modifiedBy:o,
      description: "Create Node Display Instance: " + e.id,
      data: ed
    })
  })
  return m;
}
