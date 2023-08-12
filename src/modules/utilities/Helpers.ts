import { EdgeLayout } from "../enums/enumEdgeLayout";
import { Extent, Position } from "../structure/Position";
import { NodeAnchorData } from "../structure/NodeAnchorData";
import { EdgeDisplayInstance } from "../structure/Edge";
import { NodeDisplayInstance } from "../structure/Node";
import { EdgeSide } from "../enums/enumEdgeSide";
import { EdgeRelationships } from "../enums/enumEdgeRelationships";
import { layouts } from "../data/layout"
import { JunctionDisplayInstance } from "../structure/Junction";
import { DisplayInstance } from "../structure/DisplayInstance";
import { Anchorable } from "../structure/Anchorable";
import { NodeAnchorHandler } from "../handler/NodeHandler";
import { JunctionAnchorData } from "../structure/JunctionAnchorData";

class Helpers {

  gap:number = 10;
  constructor (gap?:number) {
    this.gap = gap ? gap: 10
  }

  findAnchorableObject = (nodes:NodeDisplayInstance[], junctions:JunctionDisplayInstance[], targetId:string):NodeDisplayInstance|JunctionDisplayInstance => {
    let r:NodeDisplayInstance|JunctionDisplayInstance = nodes.find((n) => { return targetId === n.id}) as NodeDisplayInstance
    if(r === undefined) {
      r = junctions.find((j) => { return targetId === j.id}) as JunctionDisplayInstance
    }
    return r
  }

  addEdgeToAnchor = (a:NodeDisplayInstance|JunctionDisplayInstance, aid:string, eid:string) => {
    a.anchors.forEach((ai:JunctionAnchorData | NodeAnchorData) => {
      if(ai.id === aid ) {
        let found:boolean = false
        ai.edges.forEach((ei:string) => {if(ei === eid) { found = true}})
        if(!found)ai.edges.push(eid)
      }
    })
    return a
  }

  removeEdgeToAnchor = (a:NodeDisplayInstance|JunctionDisplayInstance, aid:string, eid:string) => {
    a.anchors.forEach((ai:JunctionAnchorData | NodeAnchorData) => {
      if(ai.id === aid ) {
        ai.edges.forEach((ei:string, i:number) => {if(ei === eid) { ai.edges.splice(i,1)}})
      }
    })
    return a
  }

  

  GetStyle = (tgt:string, style:string):string => {
    var el:Element|null = document.getElementById(tgt)
    if(el!=null) {
      var styles:CSSStyleDeclaration = window.getComputedStyle(el)
      return styles.getPropertyValue(style);
    } else {
      return ""
    }
  }

  getAdjustedRoute = (nodes:Array<NodeDisplayInstance>, junctions: Array<JunctionDisplayInstance>, ed:EdgeDisplayInstance, movedNodeId:string):Position[] => {
    var p:Position[] = [];
    var sp:Position = ed.route[0]; 
    var ep:Position = ed.route[ed.route.length-1]
    var nsp:Position = structuredClone(ed.route[0]); 
    var nep:Position = structuredClone(ed.route[ed.route.length-1])
    var startAngle = this.getStraightAngle(ed.route[0], ed.route[1])

    var sn = this.findAnchorableObject(nodes, junctions, ed.edgeData.sourceObject)
    var en = this.findAnchorableObject(nodes, junctions, ed.edgeData.destinationObject)

    var stretchedX:boolean = false;
    var stretchedY:boolean = false;

    if(sn!=undefined) {
      var sna = sn.anchors.find((a:NodeAnchorData)=>{ return a.id === ed.sourceAnchor}) 
     
      if(sna){
        if(sp.x != (sn.position.x + sna.position.x)) {
          stretchedX = true
          nsp.x = sn.position.x + sna.position.x
        }
        if(sp.y != sn.position.y + sna.position.y) {
          stretchedY = true
          nsp.y = sn.position.y + sna.position.y
        }
      }
    }

    if(en!=undefined) {
      var ena = en.anchors.find((a:NodeAnchorData)=> { return a.id === ed.destinationAnchor})
      if(ena) {
        if(ep.x != (en.position.x + ena.position.x)) {
          stretchedX = true;
          nep.x = en.position.x + ena.position.x
        }
        if(ep.y != (en.position.y + ena.position.y)) {
          stretchedY = true
          nep.y = en.position.y + ena.position.y
        }
      }
    }

    let ht:number = 0
    let wd:number = 0

    if(en && ena && sn && sna) {
      ht = ((en.position.y + ena.position.y) - (sn?.position.y + sna?.position.y))
      wd = ((en.position.x + ena.position.x) - (sn.position.x + sna.position.x))
    }

    p.push(nsp)

    let pts:Array<Position>  = structuredClone(ed.route);
    
    if(ed.route.length < 3 && ed.style.layout === EdgeLayout.Straight) {
      p.push(nep)
    } 
    else if(ed.style.layout === EdgeLayout.NinetyDegree ||  ed.style.layout === EdgeLayout.Rounded) {
      for(let i:number = 1; i < pts.length-1; i++) {
        let np:Position = pts[i]
        if(i == 1 && i ===  pts.length - 2 ) {
          if(startAngle === 0 || startAngle === 180) {
            np.x = nsp.x
            np.y = nep.y
          } else if(startAngle === 90 || startAngle === 270) {
            np.x = nep.x
            np.y = nsp.y
          }
        } else if(i === 1) {
          if(startAngle === 0 || startAngle === 180) {
            np.y = nsp.y
          } else if(startAngle === 90 || startAngle === 270) {
            np.x = nsp.x
          }
        } else if(i === pts.length - 2) {
          if(startAngle === 0 || startAngle === 180) {
            np.y = nep.y
          } else if(startAngle === 90 || startAngle === 270) {
            np.x = nep.x
          }
        }

        p.push(np)
      }

      p.push(nep);
    } else if(ed.style.layout == EdgeLayout.Bezier) {
      p = structuredClone(ed.route)

      if(sn!=undefined && ed.edgeData.sourceObject === movedNodeId) {
        var sna = sn.anchors.find((a:NodeAnchorData)=>{ return a.id === ed.sourceAnchor}) 
        let np:Position = {
          x: sn.position.x + (sna?.position.x as number), 
          y: sn.position.y + (sna?.position.y as number)
        }
        p[0] = np
      }
  
      if(en!=undefined && ed.edgeData.destinationObject === movedNodeId) {
         var ena = en.anchors.find((a:NodeAnchorData)=> { return a.id === ed.destinationAnchor})
         let np:Position = {
          x: en.position.x + (ena?.position.x as number), 
          y: en.position.y + (ena?.position.y as number)
        }
        p[5] = np
      }
    }
    return p;
  }

  getStraightAngle = (origin:Position, target:Position):number => {
    var dx = origin.x - target.x;
    var dy = - origin.y + target.y;

    var theta = Math.atan2(dy, -dx); 
    theta *= (180 / Math.PI)
    if (theta < 0) theta += 360;     
    return theta;
  }

  getOrthagonalAngle = (s:Position, e:Position):number => {
    let r:number = 0;

    if((s.x > e.x) && (s.y === e.y)) {
      r = 0
    } else if((s.x < e.x) && (s.y === e.y)) {
      r = 180
    } else if((s.y < e.y) && (s.x === e.x)) {
      r = 90
    } else if((s.y > e.y) && (s.x === e.x)) {
      r = 270
    }
    
    return r
  }

  rotate = (angle:number, pos:Position, origin:Position):Position => {
    var rad = (Math.PI/180)*(360-angle)
    var cos = Math.cos(rad)
    var sin = Math.sin(rad)
    var nx = (cos*(pos.x - origin.x)) + (sin * (pos.y  - origin.y)) + origin.x
    var ny = (cos * (pos.y - origin.y)) - (sin * (pos.x - origin.x)) + origin.y
    return {x:nx, y:ny}
  }

  getInverse = (pos:Position, pivot:Position):Position => {
    let i:Position = {x:0, y:0 }
    let dx:number = pos.x - pivot.x 
    let dy:number = pos.y - pivot.y 
    i.x = pivot.x - dx
    i.y = pivot.y - dy
    return i
  }

  changeEdgeLayout = (edges:EdgeDisplayInstance[], nodes:NodeDisplayInstance[], junctions:JunctionDisplayInstance[], id:string, targetLayout: EdgeLayout, set:Function) => {
    let ea:EdgeDisplayInstance[] = edges.map((ed) => {
      
      if(ed.id === id ) {
        switch (targetLayout) {
          case EdgeLayout.Bezier:
            const snb:NodeDisplayInstance|JunctionDisplayInstance = this.findAnchorableObject(nodes, junctions, ed.edgeData.sourceObject)
            const dnb:NodeDisplayInstance|JunctionDisplayInstance = this. findAnchorableObject(nodes, junctions, ed.edgeData.destinationObject) 
 
        // M EP1       C HP1       HP2       EP1       S HP3       EP2 
        // M 1340,1100 C 1340,1200 1240,1230 1270,1200 S 1100,1250 1140,1300 
        // 0 1         2 3         4         5         6 7         8
        //   0           1         2         3           4         5
            let m:Position = ed.route[0]
            let ep2:Position = ed.route[ed.route.length -1 ]
            let re:Extent = this.getExtents(ed.route)
            let ep1:Position = {x: re.topleft.x + Math.abs((re.bottomright.x - re.topleft.x)/2), y: re.topleft.y + Math.abs((re.bottomright.y - re.topleft.y)/2)}
            let hp1:Position = {x:0, y:0}
            let hp2:Position = {x:0, y:0}
            let hp3:Position = {x:0, y:0}

            switch(ed.style.layout) {
              case EdgeLayout.Bezier:
                ed.route = ed.route
                break
              case EdgeLayout.NinetyDegree:
              case EdgeLayout.Rounded:
              case EdgeLayout.Straight:
                const ssb:EdgeSide = this.getSide(snb, ed.sourceAnchor)
                const dsb:EdgeSide = this.getSide(dnb, ed.destinationAnchor)
                switch(ssb) {
                  case EdgeSide.Top:
                    hp1.x = m.x
                    hp1.y = m.y - (0.25 * (re.bottomright.y - re.topleft.y))
                    break
                  case EdgeSide.Right:
                    hp1.x = m.x + (0.25 * (re.bottomright.x - re.topleft.x))
                    hp1.y = m.y
                    break
                  case EdgeSide.Bottom:
                    hp1.x = m.x
                    hp1.y = m.y + (0.25 * (re.bottomright.y - re.topleft.y))
                    break
                  case EdgeSide.Left:
                    hp1.x = m.x - (0.25 * (re.bottomright.x - re.topleft.x))
                    hp1.y = m.y
                    break
                }

                if(re.bottomright.x - re.topleft.x > re.bottomright.y - re.topleft.y ){
                  if (snb.position.x > dnb.position.x) {
                    hp2.x = ep1.x + (0.25 * (re.bottomright.x - re.topleft.x))
                  } else {
                    hp2.x = ep1.x - (0.25 * (re.bottomright.x - re.topleft.x))
                  }
                  hp2.y = ep1.y
                }else  {
                  if (snb.position.y > dnb.position.y) {
                    hp2.y = ep1.y + (0.25 * (re.bottomright.y - re.topleft.y))
                  } else {
                    hp2.y = ep1.y - (0.25 * (re.bottomright.y - re.topleft.y))
                  }
                  hp2.x = ep1.x
                }

                switch(dsb) {
                  case EdgeSide.Top:
                    hp3.x = ep2.x
                    hp3.y = ep2.y - (0.25 * (re.bottomright.y - re.topleft.y))
                    break
                  case EdgeSide.Right:
                    hp3.x = ep2.x + (0.25 * (re.bottomright.x - re.topleft.x))
                    hp3.y = ep2.y
                    break
                  case EdgeSide.Bottom:
                    hp3.x = ep2.x
                    hp3.y = ep2.y + (0.25 * (re.bottomright.y - re.topleft.y))
                    break
                  case EdgeSide.Left:
                    hp3.x = ep2.x - (0.25 * (re.bottomright.x - re.topleft.x))
                    hp3.y = ep2.y
                    break
                }
                ed.route = [m, hp1, hp2, ep1, hp3,ep2 ]
                break
            }
            ed.style.layout = EdgeLayout.Bezier
            break
          case EdgeLayout.NinetyDegree:
          case EdgeLayout.Rounded:
              const s:Position = ed.route[0]
              const d:Position = ed.route[ed.route.length-1]
              const sn:NodeDisplayInstance|JunctionDisplayInstance = this.findAnchorableObject(nodes, junctions, ed.edgeData.sourceObject)
              const dn:NodeDisplayInstance|JunctionDisplayInstance = this. findAnchorableObject(nodes, junctions, ed.edgeData.destinationObject) 
              const ss:EdgeSide = this.getSide(sn, ed.sourceAnchor)
              const ds:EdgeSide = this.getSide(dn, ed.destinationAnchor)
              ed.style.layout = targetLayout
              ed.route = this.getFiveSegmentRoute(sn, dn, ed)
            break
          case EdgeLayout.Straight:
            ed.style.layout = targetLayout
            ed.route = [ed.route[0], ed.route[ed.route.length-1]]
            break
        }
      }
      return ed;
    })
    set(ea)
  }

  getSide = (di:NodeDisplayInstance|JunctionDisplayInstance, aid:string):EdgeSide => {
    const a:NodeAnchorData|JunctionDisplayInstance = di.anchors.find((n) => { return n.id === aid }) as Anchorable
    switch(a.id) {
      case "st":
        return EdgeSide.Top
        break
      case "sr": 
        return EdgeSide.Right
        break
      case "sb": 
        return EdgeSide.Bottom
        break
      case "sl": 
        return EdgeSide.Left
        break
      default:
        if(a.position.y === 0) {
          return EdgeSide.Top
        } else if(a.position.y === di.size.height) {
          return EdgeSide.Bottom
        } else if(a.position.x === 0) {
          return EdgeSide.Left
        } else if(a.position.x === di.size.width) {
          return EdgeSide.Right
        } else {
          return EdgeSide.Top
        }
    }
  }

  getExtents = (route:Position[]):Extent => {
    let e:Extent = {
      topleft: structuredClone(route[0]),
      bottomright:structuredClone(route[0])
    }

    route.forEach((p) => {
      if(p.x < e.topleft.x) {e.topleft.x = p.x}
      if(p.y < e.topleft.y) {e.topleft.y = p.y}
      if(p.x > e.bottomright.x) {e.bottomright.x = p.x}
      if(p.y > e.bottomright.y) {e.bottomright.y = p.y}
    })
    return e
  }

  getNodeExtents = (sn:DisplayInstance, dn:DisplayInstance) => {
    let ie:Extent = { topleft: structuredClone(sn.position), bottomright: structuredClone(sn.position)}
    if(sn.position.x < ie.topleft.x) { ie.topleft.x = sn.position.x}
    if(sn.position.y < ie.topleft.y) { ie.topleft.y = sn.position.y }
    if(sn.position.x + sn.size.width > ie.bottomright.x) { ie.bottomright.x = sn.position.x + sn.size.width}
    if(sn.position.y + sn.size.height > ie.bottomright.y) { ie.bottomright.y = sn.position.y + sn.size.height }
    if(dn.position.x < ie.topleft.x) { ie.topleft.x = dn.position.x}
    if(dn.position.y < ie.topleft.y) { ie.topleft.y = dn.position.y }
    if(dn.position.x + dn.size.width > ie.bottomright.x) { ie.bottomright.x = dn.position.x + dn.size.width}
    if(dn.position.y + dn.size.height > ie.bottomright.y) { ie.bottomright.y = dn.position.y + dn.size.height }
    return ie
  }

  getLayout = (ss:EdgeSide, ds:EdgeSide):string => {
    if(ss === ds) {
      return "SS"
    } else if (ss ==EdgeSide.Top && ds === EdgeSide.Bottom 
      || ss === EdgeSide.Bottom && ds === EdgeSide.Top
      || ss === EdgeSide.Left && ds === EdgeSide.Right
      || ss === EdgeSide.Right && ds === EdgeSide.Left) {
      return "OS"
    } else if (ss ==EdgeSide.Top && ds === EdgeSide.Right 
      || ss === EdgeSide.Right && ds === EdgeSide.Bottom
      || ss === EdgeSide.Bottom && ds === EdgeSide.Left
      || ss === EdgeSide.Left && ds === EdgeSide.Top) {
      return "CW"
    }
    else if (ss ==EdgeSide.Top && ds === EdgeSide.Left 
      || ss === EdgeSide.Right && ds === EdgeSide.Top
      || ss === EdgeSide.Bottom && ds === EdgeSide.Right
      || ss === EdgeSide.Left && ds === EdgeSide.Bottom) {
      return "CCW"
    } 
    else {
      return ""
    }
  }

  getFiveSegmentRoute = (sn:NodeDisplayInstance|JunctionDisplayInstance, dn: NodeDisplayInstance|JunctionDisplayInstance, e:EdgeDisplayInstance) => {
    const sa:NodeAnchorData = sn.anchors.find((a:NodeAnchorData|JunctionAnchorData)=> { return a.id === e.sourceAnchor}) as NodeAnchorData
    const da: NodeAnchorData = dn.anchors.find((a:NodeAnchorData|JunctionAnchorData)=> { return a.id === e.destinationAnchor}) as NodeAnchorData
    console.log(sn, sa, e.sourceAnchor, dn, da, e.destinationAnchor)
    const ss1:EdgeSide = this.getSide(sn, sa.id)
    const ds1:EdgeSide = this.getSide(dn, da.id)
    const lt:string = this.getLayout(ss1, ds1)
    const n = this.getRelativePosition(sn, dn, 10)
    const k:string = lt + ":" + ss1 .toString() + "," +ds1.toString() + ":" + n + ":"
    const s:string = layouts.find((i:string) => { return i.startsWith(k)}) as string
    console.log("LAYOUT: ", k, s)

    let p:Position[] = []
    let d:string[] = s.split(":")
    let spCalc:string[] = d[3].split(",")
    let pCalc = d[4].split(",")
    
    let sp:Position = {
      x: this.calculate(spCalc[0], {x:0,y:0}, sn, dn, sa, da),
      y: this.calculate(spCalc[1], {x:0,y:0}, sn, dn, sa, da)
    }

    p.push(sp)
    pCalc.forEach((pi) => {
      let c = pi.replace("[", "").replace("]", "").split("|")
      if(c && c[0].length > 1 && c[1].length > 1) {
        let x = this.calculate(c[0], sp, sn, dn, sa, da)
        let y = this.calculate(c[1], sp, sn, dn, sa, da)
        p.push({x:x,y:y})
      } else {
      }
    })

    p.push(da.position)
    return p
  }

  isJunction = (i:DisplayInstance):boolean => {
    if(i.anchors.length === 4 && i.anchors.findIndex((a) => { return a.id === 'st'}) > -1) {
      return true
    }
    return false
  }

  calculate = (formula:string, sp:Position, sn:DisplayInstance, dn:DisplayInstance, sa:NodeAnchorData, da:NodeAnchorData):number => {
    let r = 0;
    let e:Extent = this.getNodeExtents(sn, dn)
    let f:string = formula ? formula : ""
    f = f.replaceAll('s.x', sn.position.x.toString())
    f = f.replaceAll('s.w', sn.size.width.toString())
    f = f.replaceAll('s.y', sn.position.y.toString())
    f = f.replaceAll('s.h', sn.size.height.toString())
    f = f.replaceAll('d.x', dn.position.x.toString())
    f = f.replaceAll('d.w', dn.size.width.toString())
    f = f.replaceAll('d.y', dn.position.y.toString())
    f = f.replaceAll('d.h', sn.size.height.toString())
    f = f.replaceAll("sa.x", (sn.position.x + sa.position.x).toString())
    f = f.replaceAll('sa.y', (sn.position.y + sa.position.y).toString())
    if(sp.x) {
      f = f.replaceAll('sp.x', sp.x.toString())
    }
    if(sp.y) { 
      f = f.replaceAll('sp.y', sp.y.toString())
    }
    f = f.replaceAll("da.x", (dn.position.x + da.position.x).toString())
    f = f.replaceAll('da.y', (dn.position.y + da.position.y).toString())
    f = f.replaceAll('e.tl.t', e.topleft.y.toString() + " - 10 ")
    f = f.replaceAll('e.tl.l', e.topleft.y.toString() + " - 10 ")
    f = f.replaceAll("e.br.b", e.bottomright.y.toString() + " + 10 ")
    f = f.replaceAll('e.br.r', e.bottomright.x.toString() + " + 10 ")
    f = f.replaceAll('g', this.gap.toString())

    r = eval(f)
    return r
  }  

  getRelativePosition = (sn:DisplayInstance, dn:DisplayInstance, gap:number):number => {
    let r:number = 1

    if(sn.position.x + sn.size.width + (2*gap) <= dn.position.x) { 
      if(sn.position.y + sn.size.height + (2*gap) < dn.position.y) {
        return 1
      }
      else if(dn.position.y + dn.size.height + (2*gap) <= sn.position.y) {
        return 3
      }
      else {
        return 2
      }
    } else if(dn.position.x + dn.size.width + (2*gap) <= sn.position.x) { 
      if(sn.position.y + sn.size.height + (2*gap) <= dn.position.y) {
        return 7
      }
      else if(dn.position.y + dn.size.height + (2*gap) <=sn.position.y) {
        return 9
      }
      else {
        return 8
      }
    } else {
      if(sn.position.y + sn.size.height + (2*gap) <= dn.position.y) {
        return 4
      }
      else if(dn.position.y + dn.size.height + (2*gap) <= sn.position.y) {
        return 6
      }
      else {
        return 5
      } 
    }
    return r
  }

  getEnumName = (enumObj:any, value:number):string => {
    return Object.values(enumObj)[value] as string
  }

  getLineStyle = (type:EdgeRelationships, defaultStyle:string):string => {
    switch(type) {
      case EdgeRelationships.Composition:
      case EdgeRelationships.Aggregation:
      case EdgeRelationships.Assignment:
      case EdgeRelationships.Serving:
      case EdgeRelationships.Association:
      case EdgeRelationships.Triggering:
      case EdgeRelationships.Specialization:
          return ''    
        break
      case EdgeRelationships.Access:
        return '1 1'
        break
      
      case EdgeRelationships.Flow:
      case EdgeRelationships.Influence:
        return '3 1'
        break
      case EdgeRelationships.Realization:
        return '1 2'
        break
      default:
        return defaultStyle
    }
  }
}

export default Helpers
