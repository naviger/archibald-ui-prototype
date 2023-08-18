import { CanvasMode } from "../enums/enumCanvasMode"
import { EdgeLayout } from "../enums/enumEdgeLayout"
import { EdgeRelationships } from "../enums/enumEdgeRelationships"
import { EdgeDisplayInstance } from "../structure/Edge"
import { Position } from "../structure/Position"
import Helpers from "../utilities/Helpers"
import { CanvasController } from "./CanvasController"


export class EdgePropertyBoxHandler {
  canvasController:CanvasController
  helpers:Helpers

  constructor(canvasController:CanvasController) {
    this.canvasController = canvasController
    this.helpers = new Helpers()
  }

  dragStart = (id:string, key:boolean, pos:Position) => {
    if(!key && this.canvasController.mode === CanvasMode.Ready){
      const el = document.getElementById(id) as Element
      let nodeEls = document.getElementsByClassName("toggle-pointer")
      for (let i: number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.add("no-display"); }
      this.canvasController.setDragData({type: 'property-box', currentId: id, offset:{x: (el?.clientLeft - pos.x), y:(el?.clientTop - pos.y + 32)}, position:pos})
      this.canvasController.setCanvasMode(CanvasMode.MovePropertyBox, id)
    }
  }

  dragDone = (id:string, key:boolean) => {
    let nodeEls = document.getElementsByClassName("toggle-pointer")
    for (let i: number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.remove("no-display"); }
    this.canvasController.setDragData({type: 'none', currentId: "", offset:{x: -1, y:-1}, position:{x: -1, y: -1}})
    this.canvasController.setCanvasMode(CanvasMode.Ready)
  }

  move = (id:string, pos:Position) => {
    let box:HTMLElement = document.getElementById(id) as HTMLElement
    let bbox:DOMRect = box.getBoundingClientRect()
    if(this.canvasController.mode === CanvasMode.MovePropertyBox) {
      if(box) {
        box.setAttribute("style", "left: " + (pos.x) + "px; top: " + (pos.y) + "px;")
      } 
    }
    let p:DOMRect = box.getBoundingClientRect()
    this.canvasController.setPinnedPosition({x: p.left, y:p.top })
  }

  setEdgeLayout = (id:string, layout:EdgeLayout) => {
    this.helpers.changeEdgeLayout(this.canvasController.edges, this.canvasController.nodes, this.canvasController.junctions, id, layout, this.canvasController.setEdges)
  }

  setEdgeType = (tgt:string, id:EdgeRelationships) => {
    let ea:EdgeDisplayInstance[] = this.canvasController.edges.map((ed) => {
      if(ed.edgeData.edgeId === tgt) {
        ed.edgeData.type = id
      }
      return ed
    })
    this.canvasController.setEdges(ea)
  }

  remove =  () => {
    let tgt:number = this.canvasController.edges.findIndex((e)=>{return e.isSelected===true})
    let ea = structuredClone(this.canvasController.edges)
    ea.splice(tgt, 1)
    this.canvasController.setEdges(ea)
  }

  togglePin  = () => {
    this.canvasController.setPinned(this.canvasController.pinned ? false : true)
  }

}