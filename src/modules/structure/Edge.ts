import { EdgeLayout } from '../enums/enumEdgeLayout'
import { EdgeRelationships } from '../enums/enumEdgeRelationships'
import { Position } from './Position'
import { DisplayInstance } from './DisplayInstance'

export type Edge = {
  edgeId: string
  name: string
  type: EdgeRelationships 
  sourceObject: string
  destinationObject: string
  label: string
}

export type EdgeDisplayInstance = {
  edgeData: Edge
  sourceAnchor: string
  destinationAnchor: string
  route: Array<Position> 
  style: EdgeStyle
} & DisplayInstance

export  type EdgeStyle = {
  weight: string
  layout: EdgeLayout
  color: string
  style: string
}