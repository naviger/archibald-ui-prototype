import React, { MouseEventHandler, useState } from "react"
import { Button, } from "./Button"
import './EdgePropertyBox.css'
import { EdgeLayout } from "../enums/enumEdgeLayout"
import { Position } from "../structure/Position"
import { Dropdown, IDropdownItem } from "./Dropdown"
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
  move:Function
  remove:Function
  position:Position
  dataRenderer:Function
  togglePin:Function
  pinned: boolean
}

export const EdgePropertyBox = (props:EdgePropertyBoxProps):JSX.Element => { 

const flyoutOpen = <svg width="10">
    <g>
      <path d="m 0,110 l 0 -90 a 10 10 1 0 1 10 10 l 0 95 a 10 10 1 0 1 -10 10" fill="grey"/>
      <polyline points="2,75 2,83 8,79 2,75" fill="white" />
    </g>
  </svg>

const flyoutClose = <svg width="10">
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
  
  const clickPin = () => {
    props.togglePin()
  }

  const pin = <svg xmlns="http://www.w3.org/2000/svg" id="mdi-pin-outline" x="-10" y="4" height="20" width="30" viewBox="0 0 24 24"><path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12M8.8,14L10,12.8V4H14V12.8L15.2,14H8.8Z" /></svg>

  const unpin = <svg xmlns="http://www.w3.org/2000/svg" id="mdi-pin-off" x="-10" y="4" height="20" width="30" viewBox="0 0 24 24"><path d="M2,5.27L3.28,4L20,20.72L18.73,22L12.8,16.07V22H11.2V16H6V14L8,12V11.27L2,5.27M16,12L18,14V16H17.82L8,6.18V4H7V2H17V4H16V12Z" /></svg>

  const onDragHandleMouseDown:MouseEventHandler<SVGSVGElement> = (e) => {
    props.dragStart(props.id, e.shiftKey, {x:e.pageY, y:e.pageY})
    setInDrag(true)
  }

  const onMove:MouseEventHandler<HTMLElement> = (e) => {
    let bbox:DOMRect = document.getElementById("canvas")?.getBoundingClientRect() as DOMRect
    props.move(e.currentTarget.id, {x:e.pageX - bbox.left, y:e.pageY - bbox.top}, {x:e.pageX, y:e.pageY})
  }

  const onDragHandleMouseUp:MouseEventHandler<SVGSVGElement> = (e) => {
    props.dragDone(props.id, e.shiftKey)
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
        start: getStartDecoration("ls1:dds", EdgeRelationships.Composition, {x:25,y:10}, {x:5, y:10}, 0, styles()),
        end: getEndDecoration("ls1:dde", EdgeRelationships.Composition, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Composition, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ls2:" + EdgeRelationships.Aggregation,
      value: "Aggregation",
      data: {
        start: getStartDecoration("ls2:dds", EdgeRelationships.Aggregation, {x:25,y:10}, {x:35, y:10}, 0, styles()),
        end: getEndDecoration("ls2:dde", EdgeRelationships.Aggregation, {x:10,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Aggregation, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ls3:" + EdgeRelationships.Assignment,
      value: "Assignment",
      data: {        
        start: getStartDecoration("ls3:dds", EdgeRelationships.Assignment, {x:10,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration("ls3:dde", EdgeRelationships.Assignment, {x:35,y:10}, {x:5, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Assignment, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ls4:" + EdgeRelationships.Realization,
      value: "Realization",
      data: {        
        start: getStartDecoration("ls4:dds", EdgeRelationships.Realization, {x:30,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration("ls4:dde", EdgeRelationships.Realization, {x:35,y:10}, {x:15, y:10}, 0, styles()),
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
        start: getStartDecoration("ld1:dds", EdgeRelationships.Serving, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration("ld1:dde", EdgeRelationships.Serving, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Serving, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ld2:" + EdgeRelationships.Access,
      value: "Access",
      data: {        
        start: getStartDecoration("ld2:dds", EdgeRelationships.Access, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration("ld2:dde", EdgeRelationships.Access, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Access, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ld3:" + EdgeRelationships.Influence,
      value: "Influence",
      data:{        
        start: getStartDecoration("ld3:dds", EdgeRelationships.Influence, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration("ld3:dde", EdgeRelationships.Influence, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Influence, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ld4:" + EdgeRelationships.Association,
      value: "Association",
      data: {        
        start: getStartDecoration("ld4:dds", EdgeRelationships.Association, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration("ld4:dde", EdgeRelationships.Association, {x:35,y:10}, {x:15, y:10}, 0, styles()),
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
        start: getStartDecoration("ly1:dds", EdgeRelationships.Triggering, {x:5,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration("ly1:dde", EdgeRelationships.Triggering, {x:35,y:10}, {x:15, y:10}, 0, styles()),
        lineStyle: helpers.getLineStyle(EdgeRelationships.Triggering, '')
      },
      isSelected: false,
      isSeperator:false
    },
    {
      id:"ly2:" + EdgeRelationships.Flow,
      value: "Flow",
      data: {        
        start: getStartDecoration("ly2:dds", EdgeRelationships.Flow, {x:5,y:10}, {x:15, y:10}, 20, styles()),
        end: getEndDecoration("ly2:dde", EdgeRelationships.Flow, {x:35,y:10}, {x:15, y:10}, 0, styles()),
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
        start: getStartDecoration("lo1:dds", EdgeRelationships.Specialization, {x:30,y:10}, {x:15, y:10}, 0, styles()),
        end: getEndDecoration("lo1:dde", EdgeRelationships.Specialization, {x:35,y:10}, {x:15, y:10}, 0, styles()),
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

  const pinstate = props.pinned ? pin : unpin
  
  return (
    <div id="edge-property-box" className={"property-panel toggle-pointer"+ dragStyle} style={{top:props.position.y, left: props.position.x}} onMouseMove={onMove} >
      <div className="box-handle" style={{zIndex:"999"}}>
        <div>
          
          <svg className="box-handle-svg" onMouseDown={onDragHandleMouseDown} onMouseUp={onDragHandleMouseUp} height="32" width="12">
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
      </div>
      <div id="edge-inner-property-panel" className={"inner-property-panel toggle-pointer " + dragStyle} style={{zIndex:"998"}}>
        <div className="panel-top">
          <div className='pin-indicator'>
            <svg className="pin-svg" onClick={clickPin} height="32" width="12">
              <g>
                {pinstate}
              </g>
            </svg>  
          </div>
          <div className="section-title">{props.data.name}</div>
        </div>
        <div className="section-horizontal toggle-pointer">
          <Button key="bl1" iconName={"straight"} onClick={onLayoutClick} enabled={true}  />
          <Button key="bl2" iconName={"orthagonal"} onClick={onLayoutClick} enabled={true}  />
          <Button key="bl3" iconName={"rounded"} onClick={onLayoutClick} enabled={true}  />
          <Button key="bl4" iconName={"bezier"} onClick={onLayoutClick} enabled={true}  />

          <Button key="br" iconName={"remove"} onClick={props.remove} enabled={true}  />
        </div>
        <div className="section-horizontal toggle-pointer ">
          <Dropdown onSelect={props.setEdgeType} enabled={true} items={listItems()} listRenderer={listRenderer} selectedItem={reltype} ></Dropdown>
        </div>
      </div>
      <div className="flyout-handle toggle-pointer " onClick={toggleData}>
        {showData ? flyoutClose: flyoutOpen}
      </div>
      { showData && data }
    </div>
  )
}