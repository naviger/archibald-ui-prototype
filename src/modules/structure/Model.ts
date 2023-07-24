import { IVersion } from '../utilities/IVersion';
import { EdgeDisplayInstance } from './Edge'
import { Entity } from './Entity';
import { NodeDisplayInstance } from './Node'
import { History } from './History';

export interface IModel {
  edges: Array<EdgeDisplayInstance>
  nodes: Array<NodeDisplayInstance>
  name: string
  version: IVersion
  description: string
  Owner: Entity
  history: Array<History>
}