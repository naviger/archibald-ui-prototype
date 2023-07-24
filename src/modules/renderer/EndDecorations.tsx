import { EdgeRelationships } from "../enums/enumEdgeRelationships"
import { Position } from "../structure/Position"
import { StyleObject } from "../structure/StyleObject"
import Helpers from "../utilities/Helpers"



export const getEndDecoration = (relationship:EdgeRelationships, pos:Position, origin:Position, theta:number, styles:StyleObject):JSX.Element => {
  //console.log('DECORATION PARAMETERS: ', relationship, pos, origin, theta)
  //let trfrm:string = "rotate(" + theta +")"
  const helpers = new Helpers()
  
  let dflt:JSX.Element =  <circle cx={-3} cy={-3} r={3} fill='black' />
  let pts:string = ""
  switch(relationship) {
    case EdgeRelationships.Access:
      let pos1ac = helpers.rotate(theta, {x:pos.x - 5, y:pos.y - 5}, pos)
      let pos2ac = helpers.rotate(theta, {x:pos.x - 5, y:pos.y + 5}, pos)
      pts = "" + (pos1ac.x) + "," + (pos1ac.y) + " " + pos.x + "," + pos.y + " " + (pos2ac.x) + "," + (pos2ac.y) 
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill={"none"} />)
      break;
    case EdgeRelationships.Aggregation:
      break
    case EdgeRelationships.Assignment:
      let pos1as = helpers.rotate(theta, {x:pos.x - 5, y:pos.y - 5}, pos)
      let pos2as = helpers.rotate(theta, {x:pos.x - 5, y:pos.y + 5}, pos)
      pts = "" + pos.x + "," + pos.y + " " + (pos1as.x) + "," + (pos1as.y) + " " + (pos2as.x) + "," + (pos2as.y) + " " + (pos.x) + "," + (pos.y)
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill={styles.strokeColor} />)
      break
    case EdgeRelationships.Association:
      // let pos1 = helpers.rotate(theta, pos, origin)
      let pos2 = helpers.rotate(theta, {x:pos.x - 7, y:pos.y - 5}, pos)
      pts = "" + pos.x + "," + pos.y + " " + (pos2.x) + "," + (pos2.y)
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill="none" />)
      break
    case EdgeRelationships.Composition:
      break
    case EdgeRelationships.Flow:
      let pos1f = helpers.rotate(theta, {x:pos.x - 5, y:pos.y - 5}, pos)
      let pos2f = helpers.rotate(theta, {x:pos.x - 5, y:pos.y + 5}, pos)
      pts = "" + pos.x + "," + pos.y + " " + (pos1f.x) + "," + (pos1f.y) + " " + (pos2f.x) + "," + (pos2f.y) + " " + (pos.x) + "," + (pos.y)
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray="1 0" stroke={styles.strokeColor} fill={styles.strokeColor} />)
      break
    case EdgeRelationships.Influence:
      let pos1i = helpers.rotate(theta, {x:pos.x - 5, y:pos.y - 5}, pos)
      let pos2i = helpers.rotate(theta, {x:pos.x - 5, y:pos.y + 5}, pos)
      pts = "" + (pos1i.x) + "," + (pos1i.y) + " " + pos.x + "," + pos.y + " " + (pos2i.x) + "," + (pos2i.y) 
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill={"none"} />)
      break
    case EdgeRelationships.Junction:
      break
    case EdgeRelationships.Realization:
      let pos1r = helpers.rotate(theta, {x:pos.x - 5, y:pos.y - 5}, pos)
      let pos2r = helpers.rotate(theta, {x:pos.x - 5, y:pos.y + 5}, pos)
      pts = "" + pos.x + "," + pos.y + " " + (pos1r.x) + "," + (pos1r.y) + " " + (pos2r.x) + "," + (pos2r.y) + " " + (pos.x) + "," + (pos.y)
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill="white" />)
      break
    case EdgeRelationships.Serving:
      let pos1sv = helpers.rotate(theta, {x:pos.x - 5, y:pos.y - 5}, pos)
      let pos2sv = helpers.rotate(theta, {x:pos.x - 5, y:pos.y + 5}, pos)
      pts = "" + (pos1sv.x) + "," + (pos1sv.y) + " " + pos.x + "," + pos.y + " " + (pos2sv.x) + "," + (pos2sv.y) 
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill={"none"} />)
      break
    case EdgeRelationships.Specialization:
      let pos1s = helpers.rotate(theta, {x:pos.x - 5, y:pos.y - 5}, pos)
      let pos2s = helpers.rotate(theta, {x:pos.x - 5, y:pos.y + 5}, pos)
      pts = "" + pos.x + "," + pos.y + " " + (pos1s.x) + "," + (pos1s.y) + " " + (pos2s.x) + "," + (pos2s.y) + " " + (pos.x) + "," + (pos.y)
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill="white" />)
      break
    case EdgeRelationships.Triggering:
      let pos1t = helpers.rotate(theta, {x:pos.x - 5, y:pos.y - 5}, pos)
      let pos2t = helpers.rotate(theta, {x:pos.x - 5, y:pos.y + 5}, pos)
      pts = "" + pos.x + "," + pos.y + " " + (pos1t.x) + "," + (pos1t.y) + " " + (pos2t.x) + "," + (pos2t.y) + " " + (pos.x) + "," + (pos.y)
      
      return  (<polyline points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill={styles.strokeColor} />)
      break
    case EdgeRelationships.Undefined:
      break
  }
  return dflt
}