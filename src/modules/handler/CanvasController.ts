import { StringDecoder } from "string_decoder";
import { CanvasMode } from "../enums/enumCanvasMode";
import { EdgeLayout } from "../enums/enumEdgeLayout";
import { EdgeRelationships } from "../enums/enumEdgeRelationships";
import { Anchorable } from "../structure/Anchorable";
import { DefaultValues } from "../structure/DefaultValues";
import { DragData } from "../structure/DragData";
import { Edge, EdgeDisplayInstance } from "../structure/Edge";
import { JunctionDisplayInstance } from "../structure/Junction";
import { NodeDisplayInstance } from "../structure/Node";
import { Position } from "../structure/Position";
import { IModel } from "../structure/Model";
import {History} from '../structure/History'
import { HistoryActionType } from "../enums/enumHistoryType";
import { Queue } from "../utilities/Queue";
import { DataController } from "./DataController";

export class CanvasController {
  defaults:DefaultValues
  dataController:DataController
  dragData:DragData
  setDragData: Function
  mode:CanvasMode
  setMode:Function
  nodes: Function //NodeDisplayInstance[]
  //setNodes: Function
  edges: Function //EdgeDisplayInstance[]
  //setEdges: Function
  junctions: Function //JunctionDisplayInstance[]
  //setJunctions: Function
  newEdge:EdgeDisplayInstance
  setNewEdge:Function
  selected:string
  setSelected:Function
  pinned: boolean
  setPinned: Function
  pinnedPosition: Position
  setPinnedPosition: Function
  history: Function
  //setHistory: Function
  model:IModel

  historyQueue: Queue<History> =  new Queue<History>()

  currentId:string = ""

  constructor(defaults:DefaultValues, dataController:DataController, model: IModel, mode: CanvasMode, setMode:Function, dragData:DragData, setDragData:Function, newEdge:EdgeDisplayInstance, setNewEdge:Function, selected:string, setSelected:Function, pinned: boolean, setPinned: Function, pinnedPosition: Position, setPinnedPosition: Function) {
    this.defaults = defaults
    this.dataController = dataController
    this.mode = mode
    this.setMode = setMode
    this.setDragData = setDragData
    this.dragData = dragData  
    this.nodes = ():NodeDisplayInstance[] => { return this.dataController.queues['node'].data as NodeDisplayInstance[]}
    //this.setNodes = setNodes
    this.edges = ():EdgeDisplayInstance[] => { return this.dataController.queues['edge'].data as EdgeDisplayInstance[]}
    //this.setEdges = setEdges
    this.junctions = ():JunctionDisplayInstance[] => { return this.dataController.queues['junction'].data as JunctionDisplayInstance[]}
    //this.setJunctions = setJunctions
    this.newEdge = newEdge
    this.setNewEdge = setNewEdge
    this.selected = selected
    this.setSelected = setSelected
    this.pinned = pinned
    this.setPinned = setPinned
    this.pinnedPosition = pinnedPosition
    this.setPinnedPosition = setPinnedPosition
    this.history = ():History[] => { return this.dataController.queues['history'].data as History[]}
    //this.setHistory = setHistory
    this.model = model
  }

  getUniqueId = () => {

  }

  select = (type:string, id:string, offset:Position, position:Position) => {
    let na:Array<NodeDisplayInstance> = this.nodes().map((n:NodeDisplayInstance, i:number)=>{
      if(n.id === id && type === "node") {
        n.isSelected = true
      } else {
        n.isSelected = false;
      }
      return n
    })
    this.setNodes(na)

    let ea:Array<EdgeDisplayInstance> = this.edges().map((e:EdgeDisplayInstance, i:number)=>{
      let iid:string = id.split(":")[0]
      if((e.id === id && type === "edge") || (e.id === iid && type==="edgeAnchor") || (e.id === iid && type==="edgeHandle")) {
        e.isSelected = true
      } else {
        e.isSelected = false
      }
      return e
    })
    this.setDragData({type:type, currentId: id, offset:offset, position:position} )
  }

  replaceEdge = (e:EdgeDisplayInstance, correlation:string, msg:string) => {
    let ea:Array<EdgeDisplayInstance> = this.edges().map((i:EdgeDisplayInstance) => {
      if(i.id === e.id) {
        return e
      }
      else {
        return i
      }
    })
    this.setEdges(ea)

    let eo:any = structuredClone(e)
    eo["edgeRef"] = e.edgeData.edgeId
    delete eo.edgeData
    this.addHistoryItem(correlation, HistoryActionType.Update, "EdgeDisplayInstance", "Update edge display instance " + eo.id + ":" + msg, eo)
  }

  replaceAnchorable = async (a:NodeDisplayInstance | JunctionDisplayInstance, correlation:string, msg:string) => {
    let found:boolean = false
    if(!a) return
    let na:Array<NodeDisplayInstance> = this.nodes().map((i:NodeDisplayInstance) => {
      if(i.id === a.id) {
        found=true
        return a as NodeDisplayInstance
      }
      else {
        return i
      }
    })
    
    if(found) {
      console.log("FOUND N", na, a)
      let n:any = structuredClone(a)
      n["nodeRef"] = (a as NodeDisplayInstance).nodeData.nodeId
      delete n.nodeData
      this.addHistoryItem(correlation, HistoryActionType.Update, "NodeDisplayInstance", "Update node display instance " + a.id + ": " + msg, a)
      this.setNodes(structuredClone(na))
    } else {
      let ja:Array<JunctionDisplayInstance> = this.junctions().map((i:JunctionDisplayInstance) => {
        if(i.id === a.id) {
          found=true
          return a as JunctionDisplayInstance
        }
        else {
          return i
        }
      })
  
      if(found) {
        console.log("FOUND J")
        this.setJunctions(structuredClone(ja))
        this.addHistoryItem(correlation, HistoryActionType.Update, "JunctionDisplayInstance", "Update junction display instance " + a.id + ": " + msg, a)
      }
    }
  }

  setCanvasMode = (m:CanvasMode, except?:string) => {
    except = except?.split(":")[0]
    if (this.mode != CanvasMode.Ready && this.mode != m) {
      this.clearNoPointerEvents("all")
    }
    this.setMode(m)
    switch(m) {
      case CanvasMode.AddEdge:
        this.setNoPointerEvents("edge", except)
        break
      case CanvasMode.MoveEdgeAnchor:
        this.setNoPointerEvents("node", except)
        break
      case CanvasMode.MoveEdgeEndAnchor:
        this.setNoPointerEvents("edge", except)
        break
      case CanvasMode.MoveEdgeHandle:
        this.setNoPointerEvents("all", except)
        break
      case CanvasMode.MoveJunction:
        this.setNoPointerEvents("all", except)
        break
      case CanvasMode.MoveNode:
        this.setNoPointerEvents("all", except)
        break
      case CanvasMode.MovePropertyBox:
        this.setNoPointerEvents("all", except)
        break
      case CanvasMode.ReadOnly:
        this.setNoPointerEvents("node", except)
        this.setNoPointerEvents("edge", except)
        this.setNoPointerEvents("junction", except)
        this.setNoPointerEvents("propertyBox", except)
        break
      case CanvasMode.Ready:
        this.clearTempEdge()
        this.clearNoPointerEvents("all")
        this.setNewEdge({ id:"temp-edge", edgeData: { edgeId:'temp-edge', name:'temp-edge', sourceObject:'unknown', destinationObject:'unknown',  type: EdgeRelationships.Association, label:'temp-edge'}, isSelected: false, isVisible:false, sourceAnchor:'unknown', position:{x:0, y:0}, size:{height:0, width:0}, status:0, destinationAnchor:'unknown', route: [{x:-1,y:-1},{x:-1, y:-1}], style: {weight:"1", layout: EdgeLayout.Straight, color: 'silver', style:'1'  }, anchors:[]})
        this.setDragData({type:"none", currentId: "", offset:{x:0, y:0}, position:{x: 0, y: 0}})
        break;
    }
  }

  setSelectedItem = (type:string, id:string) => {
    this.clearSelect()
    this.setSelected(type + ":" + id)
  }

  clearTempEdge = () => {
    let te = document.getElementById("temp-edge:edge")
    if(te?.getAttribute("points")) {
      te.setAttribute("points", "-1, -1 -1,-1")
    }
    if(te?.getAttribute("d")) {
      te.setAttribute("d", "M -1,-1 C -1,-1 -1,-1 -1,-1 S-1,-1 -1,-1")
    }
    let ref = te?.getAttribute("data-edge-ref") + ":edge"
    let el = document.getElementById(ref)
    el?.setAttribute("stroke-opacity", "1")
  }

  clearSelect = () => {
    let na:Array<NodeDisplayInstance> = this.nodes.map((n, i)=>{
      n.isSelected = false
      return n
    })
    this.setNodes(na)

    let ea:Array<EdgeDisplayInstance> = this.edges.map((e, i)=>{
      e.isSelected = false
      return e
    })
    
    this.setEdges(ea)
    this.setDragData({type: 'none', currentId: "", offset:{x:0, y:0}, position:{x: 0, y: 0}})
    this.removeTop()
    this.setSelected("")
  }

  setNoPointerEvents = (type:string, except?:string) => {
    let nodeEls = document.getElementsByClassName("node-ptr")
    let edgeEls = document.getElementsByClassName("edge-ptr")
    let junctionEls = document.getElementsByClassName("junction-ptr")
    let pbEls = document.getElementsByClassName("propertybox-ptr")

    if(!except) {except=""}
    switch(type) {
      case "node":
        for(let i:number = 0; i < nodeEls.length; i++) { if(nodeEls[i].id != except) {nodeEls[i].classList.add("no-pointer-events")}}
        break
      case "edge":
        for(let i:number = 0; i < edgeEls.length; i++) { if(edgeEls[i].id != except) {edgeEls[i].classList.add("no-pointer-events")}}
        break
      case "junction":
        for(let i:number = 0; i < junctionEls.length; i++) { if(junctionEls[i].id != except) {junctionEls[i].classList.add("no-pointer-events")}}
        break
      case "propertyBox":
        for(let i:number = 0; i < pbEls.length; i++) { if(pbEls[i].id != except) {pbEls[i].classList.add("no-pointer-events")}}
        break
      case "all":
        for(let i:number = 0; i < nodeEls.length; i++) { if(nodeEls[i].id != except) {nodeEls[i].classList.add("no-pointer-events")}}
        for(let i:number = 0; i < edgeEls.length; i++) { if(edgeEls[i].id != except) {edgeEls[i].classList.add("no-pointer-events")}}
        for(let i:number = 0; i < junctionEls.length; i++) { if(junctionEls[i].id != except) {junctionEls[i].classList.add("no-pointer-events")}}
        for(let i:number = 0; i < pbEls.length; i++) { if(pbEls[i].id != except) {pbEls[i].classList.add("no-pointer-events")}}
    }
    
    if(except.length > 0) {
      this.setTop(except)
    }
    let n:Element = document.getElementById(except) as Element
    n.classList.remove("no-pointer-events")
  }

  clearNoPointerEvents = (type:string) => {
    let nodeEls = document.getElementsByClassName("node-ptr")
    let edgeEls = document.getElementsByClassName("edge-ptr")
    let junctionEls = document.getElementsByClassName("junction-ptr")
    let pbEls = document.getElementsByClassName("propertybox-ptr")
    
    switch(type) {
      case "node":
        for(let i:number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.remove("no-pointer-events")}
        break
      case "edge":
        for(let i:number = 0; i < edgeEls.length; i++) { edgeEls[i].classList.remove("no-pointer-events")}
        break
      case "junction":
        for(let i:number = 0; i < junctionEls.length; i++) { junctionEls[i].classList.remove("no-pointer-events")}
        break
      case "propertyBox":
        for(let i:number = 0; i < pbEls.length; i++) { pbEls[i].classList.remove("no-pointer-events")}
        break
      case "all":
        for(let i:number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.remove("no-pointer-events")}
        for(let i:number = 0; i < edgeEls.length; i++) { edgeEls[i].classList.remove("no-pointer-events")}
        for(let i:number = 0; i < junctionEls.length; i++) { junctionEls[i].classList.remove("no-pointer-events")}
        for(let i:number = 0; i < pbEls.length; i++) { pbEls[i].classList.remove("no-pointer-events")}       
    }
  }

  setTop = (id:string) => {
    var el = document.getElementById(id) as HTMLElement
    var isSelected = el.getAttribute("data-selected")

    if(el != null && !(isSelected==="true")) {
      this.removeTop()
      el.setAttribute("data-selected", "true")

      var placeholder:Element = document.createElement("span")
      placeholder.id = "placeholder"
      var elNext = el.nextSibling
      el?.parentElement?.insertBefore(placeholder, elNext)
      
      var top = document.getElementById('top') as HTMLElement
      top.parentElement?.insertBefore(el, top)
    }
  }

  removeTop = () => {
    var el = document.querySelector('[data-selected="true"]')
    var placeholder = document.getElementById("placeholder") as HTMLElement
    if(placeholder != null && el != null) {
      var elNext = placeholder.nextSibling
      placeholder.parentElement?.insertBefore(el, elNext)
      placeholder.parentElement?.removeChild(placeholder)
      el.removeAttribute("data-selected")
    } else if(placeholder != null) {
      placeholder.parentElement?.removeChild(placeholder)
    } else if(el != null) {
      el.removeAttribute("data-selected")
    }
  }

  findEdgeByConnections = (src:string, dst:string, edgeType:EdgeRelationships):Edge|undefined => {
    let e = this.edges.find((e) => {
      return e.edgeData.sourceObject === src && e.edgeData.destinationObject === dst && e.edgeData.type === edgeType
    })

    return e?.edgeData
  }

  findEdgeDisplayByConnections = (src:string, srcA:string, dst:string, dstA:string, edgeType:EdgeRelationships):EdgeDisplayInstance|undefined => {
    let ed = this.edges.find((e) => {
      return e.sourceAnchor === srcA && e.edgeData.sourceObject === src && e.destinationAnchor === dstA && e.edgeData.destinationObject === dst && e.edgeData.type === edgeType
    })


    return ed
  }

  addHistoryItem = (correlation:string, type: HistoryActionType, objectType: string, description:string, data:object) => {
    let h:History[] = structuredClone(this.history)
    let d = new Date

    this.historyQueue.enqueue({
      correlation: correlation,
      modifiedDate: d,
      type: HistoryActionType.create,
      objectType: objectType,
      modifiedBy: this.model.Owner,
      description: description,
      data: data
    })
  }

  saveHistory = async () => {
    let h:History[] = structuredClone(this.history)
    while(!this.historyQueue.isEmpty) {
      h.push(this.historyQueue.dequeue())
    }

    this.setHistory(h)
  }
}