import { MouseEventHandler, MouseEvent } from "react"

export class NodeMouseEvents {
  
  constructor(setSelected:Function, setMouseOver:Function) {
    this.setSelected = setSelected
    this.setMouseOver = setMouseOver
  }

  setSelected:Function
  setMouseOver:Function

  handleMouseEnter:MouseEventHandler<SVGGElement> = (e) => {
    //e.preventDefault();
    this.setMouseOver(e.target)
  }

  handleMouseLeave:MouseEventHandler<SVGGElement> = (e) => {
    //e.preventDefault();
    this.setSelected(null)
  }

  handleMouseClick:MouseEventHandler<SVGGElement> = (e) => {
    //e.preventDefault();
    this.setSelected(e.target)
  }
}
