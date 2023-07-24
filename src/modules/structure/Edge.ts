import { EdgeLayout } from '../enums/enumEdgeLayout'
import { EdgeRelationships } from '../enums/enumEdgeRelationships'
import { Position } from './Position'
import { EdgeAnchorData } from './EdgeAnchorData'

export type Edge = {
  edgeId: string
  name: string
  type: EdgeRelationships 
  sourceObject: string
  destinationObject: string
  label: string
}

export type EdgeDisplayInstance = {
  id: string
  edgeData: Edge
  isVisible: boolean
  isSelected:boolean
  sourceAnchor: string
  destinationAnchor: string
  route: Array<Position> 
  style: EdgeStyle
  anchors:Array<EdgeAnchorData>
}

export  type EdgeStyle = {
  weight: string
  layout: EdgeLayout
  color: string
  style: string
}