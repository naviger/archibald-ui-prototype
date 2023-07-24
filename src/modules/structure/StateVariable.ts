export type stateSet = {
  name:string
  get:Function
  set:Function
}

export class StateVariable {
  constructor(states:stateSet[]) {
    this.stateSets =states
  }

  stateSets:stateSet[] = []

  set = (name:string, value:any) => {
    let currentState:stateSet|undefined = this.stateSets.find((s:stateSet) => {return s.name === name})
    if(currentState){
      currentState.set(value)
    }
  }

  get = (name:string):any => {
    let currentState:stateSet|undefined = this.stateSets.find((s:stateSet) => {return s.name === name})
    if(currentState){
      return currentState.get()
    }
  }
}