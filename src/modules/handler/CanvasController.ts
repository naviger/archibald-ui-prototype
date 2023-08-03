import { CanvasMode } from "../enums/enumCanvasMode";
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
  setSelected:Function

  constructor(defaults:DefaultValues, mode: CanvasMode, setMode:Function, dragData:DragData, setDragData:Function, nodes:NodeDisplayInstance[], setNodes:Function, edges:EdgeDisplayInstance[], setEdges:Function, junctions:JunctionDisplayInstance[], setJunctions:Function, newEdge:EdgeDisplayInstance, setNewEdge:Function, setSelected:Function) {
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
    this.setSelected = setSelected
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

  clearSelect = () => {
    this.clearPointerEvents()
    let na:Array<NodeDisplayInstance> = this.nodes.map((n, i)=>{
      n.isSelected=false
      return n
    })
    this.setNodes(na)

    let ea:Array<EdgeDisplayInstance> = this.edges.map((e, i)=>{
      e.isSelected=false
      return e
    })
  
    this.setEdges(ea)
    this.setDragData({type: 'none', currentId: "", offset:{x:0, y:0}, position:{x: 0, y: 0}})
  }

  setPointerEvents = (type:string, id:string) => {
    let nodeEls = document.getElementsByClassName("node")
    for(let i:number = 0; i < nodeEls.length; i++) { if(nodeEls[i].id != id) {nodeEls[i].classList.add("no-pointer-events")}}

    let n:Element = document.getElementById(id) as Element
    n.classList.remove("no-pointer-events")
  }

  clearPointerEvents = () => {
    let nodeEls = document.getElementsByClassName("node")
    for(let i:number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.remove("no-pointer-events")}
  }
}