import { IVersion } from '../utilities/IVersion';
import { EdgeDisplayInstance } from './Edge'
import { Entity } from './Entity';
import { NodeDisplayInstance } from './Node'
import { History } from './History';
import { JunctionDisplayInstance } from '../structure/Junction';

export interface IModel {
  edges: Array<EdgeDisplayInstance>
  nodes: Array<NodeDisplayInstance>
  junctions: Array<JunctionDisplayInstance>
  name: string
  version: IVersion
  description: string
  Owner: Entity
  history: Array<History>
}