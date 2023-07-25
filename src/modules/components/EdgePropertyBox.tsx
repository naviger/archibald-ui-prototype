import React, { MouseEventHandler } from "react"
import { EdgeDisplayInstance } from "../structure/Edge"
import { Button, ButtonProps } from "./Button"
import './EdgePropertyBox.css'
import { EdgeLayout } from "../enums/enumEdgeLayout"
import { Position } from "../structure/Position"
import { StateVariable, stateSet } from "../structure/StateVariable"
import { Dropdown, IDropdownItem } from "./Dropdown"
import { BaseEdge } from "../renderer/BaseEdge"
import { getStartDecoration } from "../renderer/StartDecorations"
import { EdgeRelationships } from "../enums/enumEdgeRelationships"
import { StyleObject } from "../structure/StyleObject"
import { getEndDecoration } from "../renderer/EndDecorations"
import { Edge } from "../structure/Edge"
import Helpers from '../utilities/Helpers'

export type EdgePropertyBoxProps = {
  id:string
  data:Edge
  dragStart:Function
  dragDone:Function
  setEdgeLayout:Function
  setEdgeType:Function
  remove:Function
  position:Position
  dataRenderer:Function
}

export const EdgePropertyBox = (props:EdgePropertyBoxProps):JSX.Element => { 
  
  const flyoutOpen = <svg>
    <g>
      <path d="m 0,110 l 0 -90 a 10 10 1 0 1 10 10 l 0 95 a 10 10 1 0 1 -10 10" fill="grey"/>
      <polyline points="2,75 2,83 8,79 2,75" fill="white" />
    </g>
  </svg>

const flyoutClose = <svg>
<g>
  <path d="m 0,110 l 0 -90 a 10 10 1 0 1 10 10 l 0 95 a 10 10 1 0 1 -10 10" fill="grey"/>
  <polyline points="8,75 8,83 2,79 8,75" fill="white" />
</g>
</svg>

  const [showData, setShowData] = React.useState<boolean>(false)
  const [inDrag, setInDrag] = React.useState<boolean>(false)

  const onLayoutClick:MouseEventHandler<HTMLDivElement> = (e) =>{
    const layoutString:string = e.currentTarget.getAttribute("data-layout") as string
    let layout:EdgeLayout = EdgeLayout.NinetyDegree
    switch(layoutString) {
      case "straight":
        layout = EdgeLayout.Straight
        break
      case "orthagonal":
        layout = EdgeLayout.NinetyDegree
        break
      case "rounded":
        layout = EdgeLayout.Rounded
        break
      case "bezier":
        layout = EdgeLayout.Bezier
        break
    }
    
    props.setEdgeLayout(props.id, layout)
    
  }
  
  const onDragHandleMouseDown:MouseEventHandler<SVGSVGElement> = (e) => {
    props.dragStart(e)
    setInDrag(true)
  }

  const onDragHandleMouseUp:MouseEventHandler<SVGSVGElement> = (e) => {
    props.dragDone(e)
    setInDrag(false)
  }

  const styles = ():StyleObject => { return {
    fill:"black",
    strokeColor:"black",
    strokeSize:"1",
    strokeStyle:"" 
  }}

  const listItems = () => { return [
    {
      id:"sep0",
      value: "Structural",
      data: {},
      isSelected: false,
      isSeperator:true,
      style: ''
    },{
      id:"ln1:" + EdgeRelationships.Undefined,
      value: "None",
      data: {
        start: <></>,
        end: <></>,
        style: helpers.getLineStyle(EdgeRelationships.Undefined, '')
      },
      isSelected: true,
      isSeperator:false
    },
    {
      id:"ls1:" + EdgeRelationships.Composition,
      value: "Composition",
      data: {
        start: getStartDecoration(EdgeRelationships.Composition, {x:25,y:10}, {x:5, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Composition, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Composition, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ls2:" + EdgeRelationships.Aggregation,
      value: "Aggregation",
      data: {
        start: getStartDecoration(EdgeRelationships.Aggregation, {x:25,y:10}, {x:35, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Aggregation, {x:10,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Aggregation, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ls3:" + EdgeRelationships.Assignment,
      value: "Assignment",
      data: {        
        start: getStartDecoration(EdgeRelationships.Assignment, {x:10,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Assignment, {x:35,y:10}, {x:5, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Assignment, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ls4:" + EdgeRelationships.Realization,
      value: "Realization",
      data: {        
        start: getStartDecoration(EdgeRelationships.Realization, {x:30,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Realization, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Realization, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"sep1",
      value: "Dependency",
      data: {},
      isSelected: false,
      isSeperator: true
    },
    {
      id:"ld1:" + EdgeRelationships.Serving,
      value: "Serving",
      data: {        
        start: getStartDecoration(EdgeRelationships.Serving, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Serving, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Serving, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ld2:" + EdgeRelationships.Access,
      value: "Access",
      data: {        
        start: getStartDecoration(EdgeRelationships.Access, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Access, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Access, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ld3:" + EdgeRelationships.Influence,
      value: "Influence",
      data:{        
        start: getStartDecoration(EdgeRelationships.Influence, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Influence, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Influence, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ld4:" + EdgeRelationships.Association,
      value: "Association",
      data: {        
        start: getStartDecoration(EdgeRelationships.Association, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Association, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Association, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"sep2",
      value: "Dynamic",
      data: {},
      isSelected: false,
      isSeperator: true
    },
    {
      id:"ly1:" + EdgeRelationships.Triggering,
      value: "Triggering",
      data: {        
        start: getStartDecoration(EdgeRelationships.Triggering, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Triggering, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Triggering, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ly2:" + EdgeRelationships.Flow,
      value: "Flow",
      data: {        
        start: getStartDecoration(EdgeRelationships.Flow, {x:5,y:10}, {x:15, y:10}, 20, styles()),
        end: getEndDecoration(EdgeRelationships.Flow, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Flow, '')
      },
      isSelected:false,
      isSeperator:false
    },
    {
      id:"sep3",
      value: "Other",
      data: {},
      isSelected: false,
      isSeperator: true
    },
    {
      id:"lo1:" + EdgeRelationships.Specialization,
      value: "Specialization",
      data: {        
        start: getStartDecoration(EdgeRelationships.Specialization, {x:30,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration(EdgeRelationships.Specialization, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Specialization, '')
      },
      isSelected: false,
      isSeperator:false
    }
  ]}

  const listRenderer = (item:IDropdownItem, select:MouseEventHandler<HTMLDivElement>) => {
    if(item.isSeperator) {
      return (
        <div key={item.id} id={item.id} className='dropdown-seperator'>
          <div className="dropdown-sep-name">{item.value}</div>
        </div>
      )
    } else {
      return (
        <div key={item.id} id={item.id} className="dropdown-listitem" onClick={select} data-id={item.id} data-target={props.data.edgeId}>
          <div className="dropdown-li-display"><svg><g>
          <line x1={10} y1={10} x2={35} y2={10} strokeWidth={2} stroke="black" strokeDasharray={item.data.lineStyle}/>
            {item.data.start}
            {item.data.end}
          </g></svg></div>
          <div className="dropdown-li-name">{item.value}</div>
        </div>
      )
    }
  }
  
  const toggleData = () => {
    setShowData(!showData)
  }

  const helpers = new Helpers()
  const reltype = helpers.getEnumName(EdgeRelationships, props.data.type)
  const dragStyle = inDrag ? " no-pointer-events":""
  const data = props.dataRenderer(props.data)
  return (
    <div id="edge-property-box" className={"property-panel toggle-pointer"+ dragStyle} style={{top:props.position.y, left: props.position.x}} >
      <div className="box-handle" >
        <svg className="box-handle-svg" onMouseDown={onDragHandleMouseDown} onMouseUp={onDragHandleMouseUp}>
          <path d="m 2,9 l 5,-5 l 7,0 l 0,21 l -7,0 l -5, -5 l 0, -11" stroke="darkgrey" fill="lightgrey"/>
          <circle key="c1" cx="10" cy="9" r="1.8" strokeWidth="0" fill="grey"></circle>
          <circle key="c2" cx="10" cy="15" r="1.8" strokeWidth="0" fill="grey"></circle>
          <circle key="c3" cx="10" cy="21" r="1.8" strokeWidth="0" fill="grey"></circle>
          <circle key="c4" cx="5" cy="12" r="1.8" strokeWidth="0" fill="grey"></circle>
          <circle key="c5" cx="5" cy="19" r="1.8" strokeWidth="0" fill="grey"></circle>
          
          <circle key="ci1" cx="10" cy="9" r=".75" strokeWidth="0" fill="lightgrey"></circle>
          <circle key="ci2" cx="10" cy="15" r=".75" strokeWidth="0" fill="lightgrey"></circle>
          <circle key="ci3" cx="10" cy="21" r=".75" strokeWidth="0" fill="lightgrey"></circle>
          <circle key="ci4" cx="5" cy="12" r=".75" strokeWidth="0" fill="lightgrey"></circle>
          <circle key="ci5" cx="5" cy="19" r=".75" strokeWidth="0" fill="lightgrey"></circle>
        </svg>
      </div>
      <div id="edge-inner-property-panel" className={"inner-property-panel toggle-pointer" + dragStyle}>
        <div className="section-title">{props.data.name}</div>
        <div className="section-horizontal toggle-pointer">
          <Button key="bl1" iconName={"straight"} onClick={onLayoutClick} enabled={true}  />
          <Button key="bl2" iconName={"orthagonal"} onClick={onLayoutClick} enabled={true}  />
          <Button key="bl3" iconName={"rounded"} onClick={onLayoutClick} enabled={true}  />
          <Button key="bl4" iconName={"bezier"} onClick={onLayoutClick} enabled={true}  />

          <Button key="br" iconName={"remove"} onClick={props.remove} enabled={true}  />
        </div>
        <div className="section-horizontal toggle-pointer">
          <Dropdown onSelect={props.setEdgeType} enabled={true} items={listItems()} listRenderer={listRenderer} selectedItem={reltype} ></Dropdown>
        </div>
      </div>
      <div className="flyout-handle toggle-pointer" onClick={toggleData}>
        {showData ? flyoutClose: flyoutOpen}
      </div>
      { showData && data }
    </div>
  )
}