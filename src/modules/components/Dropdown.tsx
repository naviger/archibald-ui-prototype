import {useState, MouseEventHandler } from "react"
import './Dropdown.css'
import { render } from "@testing-library/react"

export interface IDropdownItem {
  id:string
  value:string
  data:any
  isSelected:boolean
  isSeperator:boolean
}

export type DropdownProps = {
  onSelect:Function
  enabled:boolean
  items:IDropdownItem[]
  listRenderer:Function|null
  selectedItem:string
} 

export const Dropdown = (props:DropdownProps):JSX.Element =>  { 
  
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<string>(props.selectedItem)
  
  let renderedItems:JSX.Element[] =[]
  
  // const select:MouseEventHandler<HTMLDivElement> = (e) => {
  //   console.log('SELECT:', e.currentTarget.id)
  //   if(props.enabled) {
  //     props.onSelect(e.currentTarget.getAttribute('data-id') as string, e.currentTarget.getAttribute('data-target') as string)
  //     setSelectedValue(e.currentTarget.getAttribute('data-id') as string)
  //   } 
  // }

  const getSelectedName = (id:string):string => {
    return props.items.find((i) => {return i.id === id})?.value as string
  }

  const toggle = () => {setIsOpen(!isOpen)}
 
  const selectItem = (e:React.PointerEvent<HTMLDivElement>) => {
    const el = document.getElementById(e.currentTarget.id)
    console.log('EL:', e, e.currentTarget, el)
    const id:string = el?.getAttribute("data-id") as string
    const tgt:string = el?.getAttribute("data-target") as string
    props.onSelect(tgt, Number.parseInt(id.split(":")[1]))
    toggle()
  }  
  
  if(props.listRenderer) {
    renderedItems = props.items.map((i) => {
      return (props.listRenderer as Function)(i, selectItem)
    })
  } else {
    renderedItems = props.items.map((i:IDropdownItem) => {
        return (<div key={i.id} className='select-item' data-id={i.id} onClick={selectItem}>{i.value}</div>)
    })
  }

  

  const list:JSX.Element = (<div className="dropdown-list-frame">
    {renderedItems }
  </div>)

  return (
    <div className="dropdown-frame">
      <div className='dropdown-select-header' onClick={toggle}>
        <div className='dropdown-selected-item'>{getSelectedName(selectedValue)}</div>
        <div className={"dropdown-toggle" + (isOpen?" open":"")} onClick={toggle}></div>
      </div>

      {isOpen && list}
    </div>
  )
}