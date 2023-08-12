import { EdgeRelationships } from "../enums/enumEdgeRelationships";
import { Position } from "../structure/Position";
import { StyleObject } from "../structure/StyleObject";
import Helpers from "../utilities/Helpers";

export const getStartDecoration = (id:string, relationship:EdgeRelationships, pos:Position, origin:Position, theta:number, styles:StyleObject):JSX.Element => {
  const helpers = new Helpers()

  let dflt:JSX.Element = <span></span>
  let pts:string = ""
  switch(relationship) {
    case EdgeRelationships.Access:
      break;
    case EdgeRelationships.Aggregation:
      let pos1ag = helpers.rotate(theta, {x:pos.x + 7, y:pos.y - 5}, pos)
      let pos2ag = helpers.rotate(theta, {x:pos.x + 14, y:pos.y}, pos)
      let pos3ag = helpers.rotate(theta, {x:pos.x + 7, y:pos.y +5}, pos)
      pts = "" + pos.x + "," + pos.y + " " + pos1ag.x + "," + pos1ag.y + " " + pos2ag.x +"," + pos2ag.y + " " + pos3ag.x + ", " + pos3ag.y + " " + pos.x + "," + pos.y
      return  (<polyline id={id + ":start"} points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill="white" />)
      break
    case EdgeRelationships.Assignment:
      return <circle  id={id + ":start"} cx={pos.x} cy={pos.y} r={3} fill={styles.fill} />
      break
    case EdgeRelationships.Association:
      break
    case EdgeRelationships.Composition:
      let pos1c = helpers.rotate(theta, {x:pos.x + 7, y:pos.y - 5}, pos)
      let pos2c = helpers.rotate(theta, {x:pos.x + 14, y:pos.y}, pos)
      let pos3c = helpers.rotate(theta, {x:pos.x + 7, y:pos.y +5}, pos)
      pts = "" + pos.x + "," + pos.y + " " + pos1c.x + "," + pos1c.y + " " + pos2c.x +"," + pos2c.y + " " + pos3c.x + ", " + pos3c.y + " " + pos.x + "," + pos.y
      return  (<polyline  id={id + ":start"} points={pts} width={styles.strokeSize} strokeDasharray={styles.strokeStyle} stroke={styles.strokeColor} fill={styles.fill} />)
      break
    case EdgeRelationships.Flow:
      break
    case EdgeRelationships.Influence:
      break
    case EdgeRelationships.Junction:
      break
    case EdgeRelationships.Realization:
      break
    case EdgeRelationships.Serving:
      break
    case EdgeRelationships.Specialization:
      break
    case EdgeRelationships.Triggering:
      
      break
    case EdgeRelationships.Undefined:
      break
  }
  return dflt
}