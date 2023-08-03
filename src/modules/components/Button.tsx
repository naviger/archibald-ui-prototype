import { MouseEventHandler } from "react"
import './Button.css'

export type ButtonProps = {
  iconName:string
  onClick:Function
  enabled:boolean
} 

export const Button = (props:ButtonProps) => { 
  
  let fill="silver"
  if(props.enabled) {
    fill="green"
  }
  const click:MouseEventHandler<HTMLDivElement> = (e) => {
    if(props.enabled) props.onClick(e) 
  }

  const unknown = <svg><text>?</text></svg>
  const bezier = <svg height={20} width={20}>
    <ellipse cx="3" cy="12" rx="2" ry="2" fill={fill} />
    <path d="m 2,12 c 5,-1 -2,3 3,-2 s -4,-3 6,-7" fill="none" strokeWidth="2"  strokeOpacity="0.5" stroke={fill}/> 
    <ellipse cx="12" cy="3" rx="2" ry="2" fill={fill} />
  </svg>
  const straight = <svg height={20} width={20}>
    <line x1="2" y1 ="14" x2="13" y2="3" strokeWidth={2} stroke={fill} ></line>
    <path d="m 10,2 l 4,0 l 0,4 l -4,-4" fill={fill} strokeWidth="0" stroke={fill}/> 
  </svg>
  const orthagonal = <svg height={20} width={20}>
    <line x1="2" y1 ="15" x2="2" y2="2" strokeWidth={2} stroke={fill} ></line>
    <line x1="3" y1 ="3" x2="15" y2="3" strokeWidth={2} stroke={fill} ></line>
    <path d="m 13,0 l 0,6 l 3,-3 l -3,-3" fill={fill} strokeWidth="0" stroke={fill}/> 
  </svg>
  const rounded = <svg height={20} width={20}>
    <path d="m 3,15 l 0 -8 a 4 4 0 01 4 -4 l 8 0 "  fill="none" strokeWidth="2"  stroke={fill} />
    <path d="m 13,0 l 0,6 l 3,-3 l -3,-3" fill={fill} strokeWidth="0" stroke={fill}/> 
  </svg>
  const remove = <svg height={20} width={20}>
    <path d="m0,0 l 3,0 l 5,5 l 5,-5 l 3,0 l -6,7 l 6,7 l -3,0 l -5,-5 l -5,5 l -3,0 l 6,-7 l -6,-7"  fill="red" strokeWidth="0" />
  </svg>
  let icon = unknown


  switch (props.iconName) {
    case "straight":
      icon = straight
      break
    case "orthagonal":
      icon=orthagonal
      break
    case "rounded":
      icon = rounded  
      break
    case "bezier":
      icon = bezier
      break
    case "remove":
      icon = remove
      break
    default:
      icon = unknown
  }

  return (
    <div key={"btn-" + props.iconName} className={'button btn-' + props.iconName} onMouseDown={click} data-layout={props.iconName} >
      { icon }
    </div>
  )
}