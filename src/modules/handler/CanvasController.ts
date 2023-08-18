import { StringDecoder } from "string_decoder";
import { CanvasMode } from "../enums/enumCanvasMode";
import { EdgeLayout } from "../enums/enumEdgeLayout";
import { EdgeRelationships } from "../enums/enumEdgeRelationships";
import { Anchorable } from "../structure/Anchorable";
import { DefaultValues } from "../structure/DefaultValues";
import { DragData } from "../structure/DragData";
import { EdgeDisplayInstance } from "../structure/Edge";
import { JunctionDisplayInstance } from "../structure/Junction";
import { NodeDisplayInstance } from "../structure/Node";
import { Position } from "../structure/Position";

export class CanvasController {
  defaults:DefaultValues
  dragData:DragData
  setDragData: Function
  mode:CanvasMode
  setMode:Function
  nodes: NodeDisplayInstance[]
  setNodes: Function
  edges: EdgeDisplayInstance[]
  setEdges: Function
  junctions: JunctionDisplayInstance[]
  setJunctions: Function
  newEdge:EdgeDisplayInstance
  setNewEdge:Function
  selected:string
  setSelected:Function
  pinned: boolean
  setPinned: Function
  pinnedPosition: Position
  setPinnedPosition: Function

  currentId:string = ""

  constructor(defaults:DefaultValues, mode: CanvasMode, setMode:Function, dragData:DragData, setDragData:Function, nodes:NodeDisplayInstance[], setNodes:Function, edges:EdgeDisplayInstance[], setEdges:Function, junctions:JunctionDisplayInstance[], setJunctions:Function, newEdge:EdgeDisplayInstance, setNewEdge:Function, selected:string, setSelected:Function,   pinned: boolean, setPinned: Function, pinnedPosition: Position, setPinnedPosition: Function) {
    this.defaults = defaults
    this.mode = mode
    this.setMode = setMode
    this.setDragData = setDragData
    this.dragData = dragData  
    this.nodes = nodes
    this.setNodes = setNodes
    this.edges = edges
    this.setEdges = setEdges
    this.junctions = junctions
    this.setJunctions = setJunctions
    this.newEdge = newEdge
    this.setNewEdge = setNewEdge
    this.selected = selected
    this.setSelected = setSelected
    this.pinned = pinned
    this.setPinned = setPinned
    this.pinnedPosition = pinnedPosition
    this.setPinnedPosition = setPinnedPosition
  }

  select = (type:string, id:string, offset:Position, position:Position) => {
    let na:Array<NodeDisplayInstance> = this.nodes.map((n, i)=>{
      if(n.id === id && type === "node") {
        n.isSelected = true
        //helpers.setPointerEvents("node", id)
      } else {
        n.isSelected = false;
      }
      return n
    })
    this.setNodes(na)

    let ea:Array<EdgeDisplayInstance> = this.edges.map((e, i)=>{
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

  replaceEdge = (e:EdgeDisplayInstance) => {
    let ea:Array<EdgeDisplayInstance> = this.edges.map((i) => {
      if(i.id === e.id) {
        return e
      }
      else {
        return i
      }
    })

    this.setEdges(ea)
  }

  replaceAnchorable = (a:NodeDisplayInstance | JunctionDisplayInstance) => {
    let found:string = ""
    if(!a) return
    let na:Array<NodeDisplayInstance> = this.nodes.map((i:NodeDisplayInstance) => {
      if(i.id === a.id) {
        found="n"
        return a as NodeDisplayInstance
      }
      else {
        return i
      }
    })

    if(found) {
      this.setNodes(na)
    } else {
      let ja:Array<JunctionDisplayInstance> = this.junctions.map((i:JunctionDisplayInstance) => {
        if(i.id === a.id) {
          found="j"
          return a as JunctionDisplayInstance
        }
        else {
          return i
        }
      })
  
      if(found === "j") {
        this.setJunctions(ja)
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
}