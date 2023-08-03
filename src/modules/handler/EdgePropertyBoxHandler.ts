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
      const el = document.getElementById(id)
      let nodeEls = document.getElementsByClassName("toggle-pointer")
      for (let i: number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.add("no-pointer-events"); }
      const bbox = el?.getBoundingClientRect() as DOMRect;
      this.canvasController.setDragData({type: 'property-box', currentId: id, offset:{x: pos.x - bbox.left, y:pos.y - bbox.top}, position:pos})
      this.canvasController.setMode(CanvasMode.MovePropertyBox)
    }
  }

  dragDone = (id:string, key:boolean) => {
    let nodeEls = document.getElementsByClassName("toggle-pointer")
    for (let i: number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.remove("no-pointer-events"); }
    this.canvasController.setDragData({type: 'none', currentId: "", offset:{x: -1, y:-1}, position:{x: -1, y: -1}})
    this.canvasController.setMode(CanvasMode.Ready)
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

}