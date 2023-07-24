import { EdgeLayout } from "../enums/enumEdgeLayout";
import { Extent, Position } from "../structure/Position";
import { NodeAnchorData } from "../structure/NodeAnchorData";
import { Edge, EdgeDisplayInstance } from "../structure/Edge";
import { NodeDisplayInstance } from "../structure/Node";
import { EdgeAnchorCollection } from "../structure/EdgeAnchorCollection";
import { EdgeSide } from "../enums/enumEdgeSide";
import { EdgeDirection } from "../enums/enumEdgeDirection";
import { EdgeRelationships } from "../enums/enumEdgeRelationships";
import { layouts } from "../data/layout"
// import { get } from "http";
// import { resolveAny } from "dns";

class Helpers {

  gap:number = 10;
  constructor (gap?:number) {
    this.gap = gap ? gap: 10
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

  getAdjustedRoute = (nodes:Array<NodeDisplayInstance>, ed:EdgeDisplayInstance, movedNodeId:string):Position[] => {
    var p:Position[] = [];
    var sp:Position = ed.route[0]; 
    var ep:Position = ed.route[ed.route.length-1]
    var nsp:Position = structuredClone(ed.route[0]); 
    var nep:Position = structuredClone(ed.route[ed.route.length-1])
    var startAngle = this.getStraightAngle(ed.route[0], ed.route[1])
    //var endAngle = this.getStraightAngle(ed.route[ed.route.length - 2], ed.route[ed.route.length - 1])
    //console.log('ANGLES: ', ed.edgeData.edgeId, startAngle, endAngle)
    let lst = ed.route.length

    var sn:NodeDisplayInstance = nodes.find((n:NodeDisplayInstance)=> { return n.id == ed.edgeData.sourceObject}) as NodeDisplayInstance
    var en:NodeDisplayInstance = nodes.find((n:NodeDisplayInstance)=> { return n.id == ed.edgeData.destinationObject}) as NodeDisplayInstance

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
          //console.log("Stretch Y A: ", sna, sn)
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
          //console.log("Stretch Y B: ", ena, en)
          nep.y = en.position.y + ena.position.y
        }
      }
    }

   // console.log('Adjusted Route', sn, en, ed);

    var stretchX:number = 1
    var stretchY:number = 1

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
      //let vertCt = ed.route.length

      for(let i:number = 1; i < pts.length-1; i++) {
        let np:Position = pts[i]
        if(i == 1 && i ===  pts.length - 2 ) {
          //console.log('BOTH - 2 leg', ed.edgeData.edgeId)
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

      var sn:NodeDisplayInstance = nodes.find((n:NodeDisplayInstance)=> { return n.id == ed.edgeData.sourceObject}) as NodeDisplayInstance
      var en:NodeDisplayInstance = nodes.find((n:NodeDisplayInstance)=> { return n.id == ed.edgeData.destinationObject}) as NodeDisplayInstance
  
      // var stretchedX:boolean = false;
      // var stretchedY:boolean = false;
  
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
    //console.log('COUNT COMPARE: ', lst, p.length)
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

  getSurroundingEdgeAnchors = (id:string):EdgeAnchorCollection => {
  //IEdgeAnchor[] => {
    let c:EdgeAnchorCollection = { prev:undefined, current:undefined, next:undefined}
    
    let anchors:HTMLCollectionOf<Element> = document.getElementsByClassName("edge-anchor") as HTMLCollectionOf<Element> 
    //let ac:Element[] = anchors.
    
    let anchorArray = Array.from(anchors).sort((a:Element,b:Element) => {
      if (a && b ) {
        let aid = a.getAttribute('id') as string
        let bid = b.getAttribute('id') as string
        return (aid > bid) ? 1 : -1
      }
      return 0
    })

    //console.log('FIND: ' + id + ' out of ' + anchorArray.length + ' records in: ', anchorArray)

    let p:Element | null = null
    let next = false;
    for(let i:number = 0; i < anchorArray.length;i++) {
      
      if(next) {
        c.next = anchors.item(i) as Element
        next = false
      }

      if(anchors.item(i)?.getAttribute('id') === id) {
        c.prev = p as Element
        c.current = anchors.item(i) as Element
        next =true;
      }
      p = anchors.item(i)
    }

    return c
  }

  changeEdgeLayout = (edges:EdgeDisplayInstance[], nodes:NodeDisplayInstance[], id:string, targetLayout: EdgeLayout, set:Function) => {
    console.log("EDGE 1:", id, targetLayout)
    
    let ea:EdgeDisplayInstance[] = edges.map((ed) => {
      
      if(ed.id === id ) {
        console.log("EDGE 2:", ed.style.layout, targetLayout)
        switch (targetLayout) {
          case EdgeLayout.Bezier:
            console.log('convert to bezier')
            const snb:NodeDisplayInstance = nodes.find((n) => { return ed.edgeData.sourceObject === n.id}) as NodeDisplayInstance
            const dnb:NodeDisplayInstance = nodes.find((n) => { return ed.edgeData.destinationObject === n.id}) as NodeDisplayInstance
        // M EP1       C HP1       HP2       EP1       S HP3       EP2 
        // M 1340,1100 C 1340,1200 1240,1230 1270,1200 S 1100,1250 1140,1300 
        // 0 1         2 3         4         5         6 7         8
        //   0           1         2         3           4         5
            let m:Position = ed.route[0]
            let ep2:Position = ed.route[ed.route.length -1 ]
            let re:Extent = this.getExtents(ed.route)
            console.log("EXTENTS:", re, ed.route)
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
            
            console.log('convert to ' + (targetLayout === EdgeLayout.NinetyDegree ? " 90 degrees " : " rounded") )
            // if(ed.style.layout === EdgeLayout.NinetyDegree || ed.style.layout == EdgeLayout.Rounded) {
            //   ed.style.layout = targetLayout
            // } else if(ed.style.layout === EdgeLayout.Bezier) {
            
            // } else if( ed.style.layout == EdgeLayout.Straight) {
              console.log('route:', ed.route)
              const s:Position = ed.route[0]
              const d:Position = ed.route[ed.route.length-1]
              const sn:NodeDisplayInstance = nodes.find((n) => { return ed.edgeData.sourceObject === n.id}) as NodeDisplayInstance
              const dn:NodeDisplayInstance = nodes.find((n) => { return ed.edgeData.destinationObject === n.id}) as NodeDisplayInstance
              const ss:EdgeSide = this.getSide(sn, ed.sourceAnchor)
              const ds:EdgeSide = this.getSide(dn, ed.destinationAnchor)
              console.log('Z: ', structuredClone(sn), structuredClone(dn))
              ed.style.layout = targetLayout
              ed.route = this.getFiveSegmentRoute(sn, dn, ed)

            //   console.log("SS:", ss, "DS:", ds)
            //   if((ss ===  EdgeSide.Top && ds === EdgeSide.Bottom) || (ss ===  EdgeSide.Bottom && ds === EdgeSide.Top) ) {
            //     if(ss === EdgeSide.Bottom && sn.position.y > dn.position.y) {
            //       ed.route = [s, {x:s.x ,y:(s.y + d.y)/2 }, {x:d.x ,y:(s.y + d.y)/2}, d]
            //     } else if(ss === EdgeSide.Bottom && sn.position.y < dn.position.y) { 
            //       let e:Extent = this.getNodeExtents(sn, dn)
            //       ed.route =[s, 
            //         {x:s.x, y:e.bottomright.y + 25}, 
            //         {x:e.bottomright.x + 25, y: e.bottomright.y + 25}, 
            //         {x:e.bottomright.x + 25, y: e.topleft.y - 25}, 
            //         {x:s.x, y:e.topleft.y - 25},
            //       d]
            //     } else if(ss === EdgeSide.Bottom && sn.position.y === dn.position.y) { 
            //       let e:Extent = this.getNodeExtents(sn, dn)
            //       let splitX:number = (sn.position.x + sn.size.width) < dn.position.x 
            //         ? sn.position.x + sn.size.width + (dn.position.x - (sn.position.x + sn.size.width))/2 
            //         : (dn.position.x + dn.size.width) < sn.position.x 
            //           ? dn.position.x + dn.size.width + (sn.position.x - (dn.position.x + dn.size.width))/2 
            //           : e.topleft.x + ((e.bottomright.x - e.topleft.x)/2) 
            //       ed.route = [s,
            //         {x:s.x, y:e.bottomright.y + 25}, 
            //         {x:splitX, y: e.bottomright.y + 25},
            //         {x:splitX, y: e.topleft.y - 25},
            //         {x:d.x, y: e.topleft.y - 25},
            //       d]
            //     } else if(ss === EdgeSide.Top && sn.position.y > dn.position.y) {
            //       ed.route = [s, {x:s.x ,y:(s.y + d.y)/2 }, {x:d.x ,y:(s.y + d.y)/2}, d]
            //     } else if(ss === EdgeSide.Top && sn.position.y < dn.position.y) { 
            //       let e:Extent = this.getNodeExtents(sn, dn)
            //       ed.route =[s, 
            //         {x:s.x, y:e.topleft.y - 25}, 
            //         {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
            //         {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
            //         {x:s.x, y:e.bottomright.y + 25},
            //       d]
            //     } else if(ss === EdgeSide.Top && sn.position.y === dn.position.y) { 
            //       let e:Extent = this.getNodeExtents(sn, dn)
            //       let splitX:number = (sn.position.x + sn.size.width) < dn.position.x 
            //         ? sn.position.x + sn.size.width + (dn.position.x - (sn.position.x + sn.size.width))/2 
            //         : (dn.position.x + dn.size.width) < sn.position.x 
            //           ? dn.position.x + dn.size.width + (sn.position.x - (dn.position.x + dn.size.width))/2 
            //           : e.topleft.x + ((e.bottomright.x - e.topleft.x)/2) 
            //       ed.route = [s,
            //         {x:s.x, y:e.bottomright.y + 25}, 
            //         {x:splitX, y: e.bottomright.y + 25},
            //         {x:splitX, y: e.topleft.y - 25},
            //         {x:d.x, y: e.topleft.y - 25},
            //       d]
            //     }
            //   }
            //   else if((ss === EdgeSide.Left && ds === EdgeSide.Right) || (ss === EdgeSide.Right && ds === EdgeSide.Left)) { // <<<<< OPPOSITE SIDES
            //     if(ss === EdgeSide.Right && sn.position.x > dn.position.x) {  // <<<<<< start side is right and start node is to the right of destination
            //       ed.route = [s, {x:(s.x + d.x)/2 ,y:s.y}, {x:(s.x + d.x)/2,y:d.y }, d]
            //     } else if(ss === EdgeSide.Left && sn.position.y < dn.position.y) {   // <<<<< start side is t
            //       let e:Extent = this.getNodeExtents(sn, dn)
            //       ed.route =[s, 
            //         {x:e.bottomright.x + 25, y:s.y}, 
            //         {x:e.bottomright.x + 25, y: e.bottomright.y + 25}, 
            //         {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
            //         {x:e.topleft.x -25, y:d.y},
            //       d]
            //     } else if(ss === EdgeSide.Right && sn.position.x === dn.position.x) { 
            //       let e:Extent = this.getNodeExtents(sn, dn)
            //       let splitY:number = (sn.position.x + sn.size.width) < dn.position.x 
            //         ? sn.position.x + sn.size.width + (dn.position.x - (sn.position.x + sn.size.width))/2 
            //         : (dn.position.x + dn.size.width) < sn.position.x 
            //           ? dn.position.x + dn.size.width + (sn.position.x - (dn.position.x + dn.size.width))/2 
            //           : e.topleft.x + ((e.bottomright.x - e.topleft.x)/2) 
            //       ed.route = [s,
            //         {x:s.x, y:e.bottomright.y + 25}, 
            //         {x:splitX, y: e.bottomright.y + 25},
            //         {x:splitX, y: e.topleft.y - 25},
            //         {x:d.x, y: e.topleft.y - 25},
            //       d]
            //     } else if(ss === EdgeSide.Left && sn.position.y > dn.position.y) {
            //       ed.route = [s, {x:s.x ,y:(s.y + d.y)/2 }, {x:d.x ,y:(s.y + d.y)/2}, d]
            //     } else if(ss === EdgeSide.Left && sn.position.y < dn.position.y) { 
            //       let e:Extent = this.getNodeExtents(sn, dn)
            //       ed.route =[s, 
            //         {x:s.x, y:e.topleft.y - 25}, 
            //         {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
            //         {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
            //         {x:s.x, y:e.bottomright.y + 25},
            //       d]
            //     } else if(ss === EdgeSide.Right && sn.position.y === dn.position.y) { 
            //       let e:Extent = this.getNodeExtents(sn, dn)
            //       let splitX:number = (sn.position.x + sn.size.width) < dn.position.x 
            //         ? sn.position.x + sn.size.width + (dn.position.x - (sn.position.x + sn.size.width))/2 
            //         : (dn.position.x + dn.size.width) < sn.position.x 
            //           ? dn.position.x + dn.size.width + (sn.position.x - (dn.position.x + dn.size.width))/2 
            //           : e.topleft.x + ((e.bottomright.x - e.topleft.x)/2) 
            //       ed.route = [s,
            //         {x:s.x, y:e.bottomright.y + 25}, 
            //         {x:splitX, y: e.bottomright.y + 25},
            //         {x:splitX, y: e.topleft.y - 25},
            //         {x:d.x, y: e.topleft.y - 25},
            //       d]
            //     }
            //   }
            //   else if(ss === EdgeSide.Top && ds === EdgeSide.Top) { 
            //     let e:Extent = this.getExtents(ed.route)
            //     ed.route = [s, {x:s.x ,y:e.topleft.y - 25}, {x:d.x ,y:e.topleft.y - 25}, d]
            //   }
            //   else if(ss === EdgeSide.Bottom && ds === EdgeSide.Bottom) { 
            //     let e:Extent = this.getExtents(ed.route)
            //     ed.route = [s, {x:s.x ,y:e.bottomright.y + 25}, {x:d.x ,y:e.bottomright.y + 25}, d]
            //   }
            //   else if(ss === EdgeSide.Left && ds === EdgeSide.Left) { 
            //     let e:Extent = this.getExtents(ed.route)
            //     ed.route = [s, {x:e.topleft.x - 25 ,y:s.y}, {x:e.topleft.x - 25,y:d.y}, d]
            //   }
            //   else if(ss === EdgeSide.Bottom && ds === EdgeSide.Bottom) { 
            //     let e:Extent = this.getExtents(ed.route)
            //     ed.route = [s, {x:e.bottomright.x + 25 ,y:s.y + 25}, {x:e.bottomright.x + 25 ,y:d.y}, d]
            //   }
            //   ed.style.layout = targetLayout
            //   ed.route = [s, {x:0 ,y:0 }, {x:0 ,y:0}, d] 
            //}
            console.log("NODES: ", sn, dn)
            break
          case EdgeLayout.Straight:
            console.log('convert to straight')
            ed.style.layout = targetLayout
            ed.route = [ed.route[0], ed.route[ed.route.length-1]]
            break
        }
        
      }
      return ed;
    })
    set(ea)
  }

  getSide = (node:NodeDisplayInstance, aid:string):EdgeSide => {
    //console.log('GET SIDE: ', node, aid)
    const na:NodeAnchorData = node.anchors.find((n) => { return n.id === aid }) as NodeAnchorData
    //console.log("NODE ANCHOR:", na)
    if(na.position.y === 0) {
      return EdgeSide.Top
    } else if(na.position.y === 100) {
      return EdgeSide.Bottom
    } else if(na.position.x === 0) {
      return EdgeSide.Left
    } else if(na.position.x === 180) {
      return EdgeSide.Right
    } else {
      return EdgeSide.Top
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

  getNodeExtents = (sn:NodeDisplayInstance, dn:NodeDisplayInstance) => {
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

  getTotalExtents = (sn:NodeDisplayInstance, dn:NodeDisplayInstance, route:Position[]):Extent => {
    let e:Extent = this.getExtents(route)
    if(sn.position.x < e.topleft.x) { e.topleft.x = sn.position.x}
    if(sn.position.y < e.topleft.y) { e.topleft.y = sn.position.y }
    if(sn.position.x > e.bottomright.x) { e.bottomright.x = sn.position.x}
    if(sn.position.y > e.bottomright.y) { e.bottomright.y = sn.position.y }
    if(dn.position.x < e.topleft.x) { e.topleft.x = dn.position.x}
    if(dn.position.y < e.topleft.y) { e.topleft.y = dn.position.y }
    if(dn.position.x > e.bottomright.x) { e.bottomright.x = dn.position.x}
    if(dn.position.y > e.bottomright.y) { e.bottomright.y = dn.position.y }
    return e
  }

  setPointerEvents = (type:string, id:string) => {
    //console.log("SET POINTER")
    let nodeEls = document.getElementsByClassName("node")
    for(let i:number = 0; i < nodeEls.length; i++) { if(nodeEls[i].id != id) {nodeEls[i].classList.add("no-pointer-events")}}

    let n:Element = document.getElementById(id) as Element
    n.classList.remove("no-pointer-events")
  }

  clearPointerEvents = () => {
    //console.log("CLEAR POINTER")
    let nodeEls = document.getElementsByClassName("node")
    for(let i:number = 0; i < nodeEls.length; i++) { nodeEls[i].classList.remove("no-pointer-events")}
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

  getFiveSegmentRoute = (sn:NodeDisplayInstance, dn: NodeDisplayInstance, e:EdgeDisplayInstance) => {
    const sa:NodeAnchorData = sn.anchors.find((a:NodeAnchorData)=> { return a.id === e.sourceAnchor}) as NodeAnchorData
    const da: NodeAnchorData = dn.anchors.find((a)=> { return a.id === e.destinationAnchor}) as NodeAnchorData
    const ss1:EdgeSide = this.getSide(sn, sa.id)
    const ds1:EdgeSide = this.getSide(dn, da.id)
    const lt:string = this.getLayout(ss1, ds1)
    const n = this.getRelativePosition(sn, dn, 10)
    const k:string = lt + ":" + ss1 .toString() + "," +ds1.toString() + ":" + n + ":"
    const s:string = layouts.find((i:string) => { return i.startsWith(k)}) as string

    let p:Position[] = []
    console.log("LAYOUT STRING:", ss1.toString(), ds1.toString(), lt, k, s)
    //OS:Top,Bottom                                                 << key 0,1, 2
    //:s.x + s.w + ((d.x - (s.x + s.w))/2),                         << Xsplit, Ysplit, 3
    //:[p1.x,e.tl.t],[sp.x,e.tl.t],[sp.x,e.br.b],[p6.x,e.br.b]      << Points p2 -> p5, 4
    let d:string[] = s.split(":")
    console.log("D: ", d)
    let spCalc:string[] = d[3].split(",")
    let pCalc = d[4].split(",")
    let sp:Position = {
      x: this.calculate(spCalc[0], {x:0,y:0}, sn, dn, sa, da),
      y: this.calculate(spCalc[1], {x:0,y:0}, sn, dn, sa, da)
    }
    
    p.push(sa.position)
    pCalc.forEach((pi) => {
      let c = pi.replace("[", "").replace("]", "").split("|")
      console.log("C: ", c, pi, )
      if(c && c[0].length > 1 && c[1].length > 1) {
        let x = this.calculate(c[0], sp, sn, dn, sa, da)
        let y = this.calculate(c[1], sp, sn, dn, sa, da)
        console.log("PUSHING: ", x, y)
        p.push({x:x,y:y})
      } else {
        console.log('skipping ', c)
      }
    })
    p.push(da.position)
    console.log("NEW POINTS:", p)
    return p
  }

  calculate = (formula:string, sp:Position, sn:NodeDisplayInstance, dn:NodeDisplayInstance, sa:NodeAnchorData, da:NodeAnchorData):number => {
    let r = 0;
    let e:Extent = this.getNodeExtents(sn, dn)

    console.log("Formula:",formula, sn, sa, dn, da, sp)
    let f:string = formula ? formula : ""
    f = f.replaceAll('s.x', sn.position.x.toString())
    //console.log("f0:", structuredClone(f))
    f = f.replaceAll('s.w', sn.size.width.toString())
    //console.log("f1:", structuredClone(f))
    f = f.replaceAll('s.y', sn.position.y.toString())
    //console.log("f2:", structuredClone(f))
    f = f.replaceAll('s.h', sn.size.height.toString())
    //console.log("f3:", structuredClone(f))
    f = f.replaceAll('d.x', dn.position.x.toString())
    //console.log("f4:", structuredClone(f))
    f = f.replaceAll('d.w', dn.size.width.toString())
    //console.log("f5:", structuredClone(f))
    f = f.replaceAll('d.y', dn.position.y.toString())
    //console.log("f6:", structuredClone(f))
    f = f.replaceAll('d.h', sn.size.height.toString())
    //console.log("f7:", structuredClone(f))
    f = f.replaceAll("sa.x", sa.position.x.toString())
    //console.log("f8:", structuredClone(f))
    f = f.replaceAll('sa.y', sa.position.y.toString())
    //console.log("f9:", structuredClone(f))
    if(sp.x) {
      f = f.replaceAll('sp.x', sp.x.toString())
    }
    //console.log("f10:", structuredClone(f))
    if(sp.y) { 
      f = f.replaceAll('sp.y', sp.y.toString())
    }
    //console.log("f11:", structuredClone(f))
    f = f.replaceAll("da.x", da.position.x.toString())
    //console.log("f12:", structuredClone(f))
    f = f.replaceAll('da.y', da.position.y.toString())
    //console.log("f13:", structuredClone(f))
    f = f.replaceAll('e.tl.t', e.topleft.y.toString() + " - 10 ")
    //console.log("f14:", structuredClone(f))
    f = f.replaceAll('e.tl.l', e.topleft.y.toString() + " - 10 ")
    //console.log("f15:", structuredClone(f))
    f = f.replaceAll("e.br.b", e.bottomright.y.toString() + " + 10 ")
    //console.log("f16:", structuredClone(f))
    f = f.replaceAll('e.br.r', e.bottomright.x.toString() + " + 10 ")
    f = f.replaceAll('g', this.gap.toString())
    //console.log("f17:", structuredClone(f))

    console.log("MODIFIED FORMULA:", structuredClone(f))
    r = eval(f)
    console.log("FORMULA RESULT: ", r)
    return r
  } 

  getRelativePosition = (sn:NodeDisplayInstance, dn:NodeDisplayInstance, gap:number):number => {
    console.log("GET RELATIVE POS:",sn, dn)
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

  getFiveSegmentRouteOld = (sn:NodeDisplayInstance, dn: NodeDisplayInstance, e:EdgeDisplayInstance):Position[] => {
    //this.getLayoutData(sn, dn, e)
    const sa:NodeAnchorData = sn.anchors.find((a:NodeAnchorData)=> { return a.id === e.sourceAnchor}) as NodeAnchorData
    const da: NodeAnchorData = dn.anchors.find((a)=> { return a.id === e.destinationAnchor}) as NodeAnchorData
    let p1: Position = {x:sn.position.x + sa.position.x, y: sn.position.y + sa.position.y}
    let p2: Position = {x:-1, y: -1}
    let p3: Position = {x:-1, y: -1}
    let p4: Position = {x:-1, y: -1}
    let p5: Position = {x:-1, y: -1}
    let p6: Position = {x:dn.position.x + da.position.x, y: dn.position.y + da.position.y}
    console.log('T1: ', structuredClone(sn))
    const ie:Extent = this.getNodeExtents(sn, dn)
    console.log('T2: ', structuredClone(sn))
    const ss:EdgeSide = this.getSide(sn, sa.id)
    console.log('T3: ', structuredClone(sn))
    const ds:EdgeSide = this.getSide(dn, da.id)
    console.log('T4: ', structuredClone(sn))
    let dir:string = "V"
    if(ie.bottomright.x - ie.topleft.x > ie.bottomright.y - ie.topleft.y) {
      dir = "H"
    }

    const gap:number = 10
    const os:number = gap
    console.log('DIR: ', dir, structuredClone(sn))
    switch(ss) {
      case EdgeSide.Left:
        p2.x = p1.x - os
        p2.y = p1.y
        p3.x = p2.x
        break
      case EdgeSide.Top:
        p2.y = p1.y - os
        p2.x = p1.x
        p3.y = p2.y
        break
      case EdgeSide.Right:
        p2.x = p1.x + os
        p2.y = p1.y
        p3.x = p2.x
        break
      case EdgeSide.Bottom:
        p2.y = p1.y + os
        p2.x = p1.x
        p3.y = p2.y
        break
    }

    switch(ds) {
      case EdgeSide.Left:
        p5.x = p6.x - os
        p5.y = p6.y
        p4.x = p5.x
        break
      case EdgeSide.Top:
        p5.y = p6.y - os
        p5.x = p6.x
        p4.y = p5.y
        break
      case EdgeSide.Right:
        p5.x = p6.x + os
        p5.y = p6.y
        p4.x = p5.x
        break
      case EdgeSide.Bottom:
        p5.y = p6.y + os
        p5.x = p6.x
        p4.y = p5.y
        break
    }

    console.log("ROUTE SO FAR: ", p1, p2, p3, p4, p5, p6, structuredClone(dn))

    const relx = this.isCloser(p1.x, p6.x, p2.x, p5.x)
    const rely = this.isCloser(p1.y, p6.y, p2.y, p5.y)
    console.log('REL: ', relx, rely, structuredClone(sn))
    // if(relx==="closer" && rely==="closer") {
    //   console.log('render: closer, closer' )
    //   switch(ss) {
    //     case EdgeSide.Left:
    //     case EdgeSide.Right:
    //       p2.x = p6.x
    //       p2.y = p1.y
    //       break
    //     case EdgeSide.Top:
    //     case EdgeSide.Bottom:
    //       p2.y = p6.y
    //       p2.x = p1.x
    //       break
    //   }
    //   return [p1, p2, p6]
    // } else if(relx === "closer" && rely === "equal") {
    //   console.log('render: closer, equal' )
    //   if(this.getLateralGap(sn, dn, "H") >= 40) {
    //     p5.x = p2.x
    //     return [p1, p2, p5, p6]
    //   } else {
    //     let y = p5.y < p2.y ? p5.y : p2.y
    //     p3.y = Math.abs(y + ((p5.y - p2.y)/2))
    //     return [p1, p2, p3, p4, p5, p6]
    //   }
    // } else if(relx === "equal" && rely === "closer") {
    //   console.log('render: equal, closer' )
    //   if(this.getLateralGap(sn, dn, "V") >= 40) {
    //     p5.y = p2.y
    //     return [p1, p2, p5, p6]
    //   } else {
    //     let x = p5.x < p2.x ? p5.x : p2.x
    //     p3.y = Math.abs(x + ((p5.x - p2.x)/2))
    //     return [p1, p2, p3, p4, p5, p6]
    //   }
    // } else if(relx === "closer" && rely === "farther") {
    //   console.log('render: closer, farther' )

    // } else if(relx === "father" && rely === "closer") {
    //   console.log('render: farther, closer' )

    // } else if(relx === "equal" && rely === "farther") {
    //   console.log("H GAP: ", this.getLateralGap(sn, dn, "H"))
    //   if(this.getLateralGap(sn, dn, "H") >= 40) {
    //     if(sn.position.x > dn.position.x) {
    //       console.log("S > D")
    //       p3.x = dn.position.x + dn.size.width + 20
    //     } else {
    //       console.log("D > S")
    //       p3.x = sn.position.x + sn.size.width + 20
    //     }
    //   } else {
    //     let ie: Extent = this.getNodeExtents(sn, dn)
    //     p3.x = ie.bottomright.x + 20
    //   }
    //   p3.y = p2.y
    //   p4.x = p3.x
    //   p4.y = p5.y

    //   console.log('render: equal, farther' )
    //   return [p1, p2, p3, p4, p5, p6]
    // } else if(relx === "farther" && rely === "equal") { 
    //   console.log('render: farther, equal' )
    //   console.log("V GAP: ", this.getLateralGap(sn, dn, "V"))
    //   if(this.getLateralGap(sn, dn, "V") >= 40) {
    //     if(sn.position.y > dn.position.y) {
    //       p3.y = dn.position.y + dn.size.height + 20
    //     } else {
    //       p3.y = sn.position.y + sn.size.height + 20
    //     }
    //   } else {
    //     let ie: Extent = this.getNodeExtents(sn, dn)
    //     p3.y = ie.bottomright.y + 20
    //   }
    //   p3.x = p2.x
    //   p4.y = p3.y
    //   p4.x = p5.x

    //   console.log('render: equal, farther' )
    //   return [p1, p2, p3, p4, p5, p6]
    // } else if(relx === "equal" && rely === "equal") {
    //   console.log('render: equal, equal' )
    //   if(ss === EdgeSide.Left || ss === EdgeSide.Right) { //LET OR RIDE START 
    //     console.log('L/R', ss, ds, structuredClone(sn))
    //     if(this.getLateralGap(sn, dn, "V") > 0) { // GAP
    //       if(ss === EdgeSide.Left && sn.position.x < dn.position.x) {
    //         p5.x = p2.x
    //       } else if(ss === EdgeSide.Left && sn.position.x >= dn.position.x) {
    //         p2.x = p5.x
    //       } else  if(ss === EdgeSide.Right && sn.position.x < dn.position.x) {
    //         p2.x = p5.x
    //       } else if(ss === EdgeSide.Right && sn.position.x >= dn.position.x) {
    //         p5.x = p2.x
    //       }
    //       return [p1, p2, p5, p6]
    //     } else {
    //       p3.x = p2.x
    //       p4.x = p5.x
    //       if(p1.y > p6.y && p1.x > p6.x) {
    //         console.log('a.1')
    //         p3.y = sn.position.y - 20
    //       } else if(p1.y > p6.y && p1.x < p6.x) {
    //         console.log('a.2')
    //         p3.y = dn.position.y + dn.size.height + 20
    //       } else if(p1.y < p6.y && p1.x > p6.x) {
    //         console.log('a.3')
    //         p3.y = sn.position.y + sn.size.height + 20
    //       } else if(p1.y < p6.y && p1.x < p6.x) {
    //         console.log('a.4')
    //         p3.y = ie.bottomright.y + 20
    //       }
    //       // if(p6.y > sn.position.y + (sn.size.height/2)){
    //       //   p3.y = ie.topleft.y - 20
    //       // } else {
    //       //   p3.y = sn.position.y + sn.size.height + 20
    //       // }
    //       p4.y = p3.y 
    //       return [p1, p2, p3, p4, p5, p6]
    //     }
    //   } else { //TOP OR BOTTOM START
    //     console.log('T/B', ss, ds, this.getLateralGap(sn, dn, "H"), structuredClone(sn))
    //     if(this.getLateralGap(sn, dn, "H") > 0) { //GAP
    //       console.log('a')
    //       if(ss === EdgeSide.Top || ss === EdgeSide.Bottom) { 
    //         console.log('a.1')
    //         p5.y = p2.y
    //       } else if(ss === EdgeSide.Top && sn.position.y >= dn.position.y) {
    //         console.log('a.2')
    //         p2.y = p5.y
    //       } else  if(ss === EdgeSide.Bottom && sn.position.y < dn.position.y) {
    //         console.log('a.3')
    //         p2.y = p5.y
    //       } else if(ss === EdgeSide.Bottom && sn.position.y >= dn.position.y) {
    //         console.log('a.4')
    //         p5.y = p2.y
    //       }
    //       console.log('route: ', p1, p2, p5, p6)
    //       return [p1, p2, p5, p6]
    //     } else {
    //       console.log('b', structuredClone(sn))
    //       p3.y = p2.y
    //       p4.y = p5.y
    //       // if(p6.x < sn.position.x + (sn.size.width/2)){
    //       //   console.log('b.1')
    //       //   p3.x = sn.position.x - 20
    //       //   p4 .x = p3.x 
    //       // } else {
    //       //   console.log('b.2')
    //       //   p3.x = ie.bottomright.x + 20
    //       // }
    //       if(p1.x > p6.x && p1.y > p6.y) {
    //         console.log('b.1')
    //         p3.x = sn.position.x - 20
    //       } else if(p1.x > p6.x && p1.y < p6.y) {
    //         console.log('b.2')
    //         p3.x = ie.topleft.x - 20
    //       } else if(p1.x < p6.x && p1.y > p6.y) {
    //         console.log('b.3')
    //         p3.x = sn.position.x + sn.size.width + 20
    //       } else if(p1.x < p6.x && p1.y < p6.y) {
    //         console.log('b.4')
    //         p3.x = ie.bottomright.x + 20
    //       }

    //       p4.x = p3.x 
    //       console.log('ROUTE B:', p1, p2, p3, p4, p5, p6)
    //       return [p1, p2, p3, p4, p5, p6]
    //     }
    //   }

    // } else if(relx === "farther" && rely === "farther") {
    //   console.log('render: farther, farther' )
    // } 
    let rot:number = 0;
    if(ss === EdgeSide.Top) {
      rot = 0
    } else if(ss === EdgeSide.Right) {
      rot = 1 
    } else if(ss === EdgeSide.Bottom) {
      rot = 2
    }
    else {
      rot = 3
    }

    let vg:number = this.getLateralGap(sn, dn, "V")
    let hg:number = this.getLateralGap(sn, dn, "H")

  //   if(ss === ds) { /////////////////////////////////////////////////////////////////////////// Same side
  //     console.log("SS:", hg, vg, this.hasHorizontalGap(sn, dn, gap), this.hasVerticalGap(sn, dn, gap))
  //     if(!this.hasHorizontalGap(sn, sn, gap) && (ss === EdgeSide.Top || ss == EdgeSide.Bottom)) { //hg <= gap && 
  //       // 1a, 3 segments
  //       let tx:number = p2.x
  //       // 1c, 5 segments
  //       switch(ss) {
  //         case EdgeSide.Top:
  //           if(sn.position.x > dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("1")
  //             tx = sn.position.x - os
  //           } else if(sn.position.x < dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("2")
  //             tx = sn.position.x + sn.size.width + os
  //           } else if(sn.position.x > dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("3")
  //             tx = dn.position.x + dn.size.width + os
  //           } else if(sn.position.x < dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("4")
  //             tx = dn.position.x - os
  //           } 
  //           p3.x = tx
  //           p3.y = p2.y
  //           p4.x = p3.x
  //           p4.y = p5.y
  //           break 
  //         case EdgeSide.Bottom:
  //           if(sn.position.x > dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("1")
  //             tx = dn.position.x + dn.size.width + os
  //           } else if(sn.position.x < dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("2")
  //             tx = dn.position.x - os //sn.position.x + sn.size.width + 20
  //           } else if(sn.position.x > dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("3")
  //             tx = sn.position.x - os
  //           } else if(sn.position.x < dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("4")
  //             tx = sn.position.x + sn.size.width + os
  //           } 
  //           p3.x = tx
  //           p3.y = p2.y
  //           p4.x = p3.x
  //           p4.y = p5.y 
  //           break
  //       }

  //       console.log(p1,p2,p3,p4,p5,p6)
  //       return [p1,p2,p3,p4,p5,p6]
  //     } else if(vg <= gap && (ss === EdgeSide.Left || ss == EdgeSide.Right)) { 
  //       let ty:number = p2.y
  //       switch(ss) {
  //         case EdgeSide.Left:
  //           if(sn.position.x > dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("L1")
  //             ty = dn.position.y - os
  //           } else if(sn.position.x < dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("L2")
  //             ty = sn.position.y + sn.size.height + os
  //           } else if(sn.position.x > dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("L3")
  //             ty = dn.position.y + dn.size.height + os
  //           } else if(sn.position.x < dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("L4")
  //             ty = sn.position.y - os
  //           } 
  //           p3.y = ty
  //           p3.x = p2.x
  //           p4.y = p3.y
  //           p4.x = p5.x
  //           break 
  //         case EdgeSide.Right:
  //           if(sn.position.x > dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("R1")
  //             ty = sn.position.y - os
  //           } else if(sn.position.x < dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("R2")
  //             ty = sn.position.y + sn.size.height + os
  //           } else if(sn.position.x > dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("R3")
  //             ty = dn.position.y + dn.size.height + os
  //           } else if(sn.position.x < dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("R4")
  //             ty = dn.position.y - os
  //           } 
  //           p3.y = ty
  //           p3.x = p2.x
  //           p4.y = p3.y
  //           p4.x = p5.x
  //           break 
  //         }

  //       console.log(p1,p2,p3,p4,p5,p6)
  //       return [p1,p2,p3,p4,p5,p6]
  //     } else {
  //       switch(ss) {
  //         case EdgeSide.Top:
  //           if(sn.position.y < dn.position.y) {
  //             p5.y = p2.y
  //           } else {
  //             p2.y = p5.y
  //           }
  //           break
  //         case EdgeSide.Bottom:
  //           if(sn.position.y < dn.position.y) {
  //             p2.y = p5.y
  //           } else {
  //             p5.y = p2.y
  //           }
  //           break
  //         case EdgeSide.Left:
  //           if(sn.position.x < dn.position.x) {
  //             p5.x = p2.x
  //           } else {
  //             p2.x = p5.x
  //           }
  //           break
  //         case EdgeSide.Right:
  //           if(sn.position.x < dn.position.x) {
  //             p2.x = p5.x
  //           } else {
  //             p5.x = p2.x
  //           }
  //           break
  //       }
  //       return [p1,p2, p5, p6]

  //     }
  //   } else if(ss + 1 === ds || (ss + 1 ) % 4 === ds ) { //////////////////////////////////////// CW
  //       if(hg > gap && (ss === EdgeSide.Top || ss === EdgeSide.Bottom)) {
  //         // 2a, 4 segments
  //         let tx:number = p2.x

  //         switch(ss) {
  //           case EdgeSide.Top:
  //             break
  //           case EdgeSide.Bottom:
  //             break
  //         }
  //       } else if (hg > 25 && vg <= 25) {
  //         // 2b, 4 segments
  //       } else {
  //         // 2c, 4 segments 
  //       }
  //   } else if(ss + 2 === ds || (ss + 2 ) % 4 === ds ) { //////////////////////////////////////// Opposing Sides
  //     const fgap:number = 2*gap
  //     if(hg > gap && (ss === EdgeSide.Top || ss === EdgeSide.Bottom)) {
  //       console.log("OS:", hg, vg)
  //       // 3a, 3 segments
  //       let tx:number = p2.x
  //       switch(ss) {
  //         case EdgeSide.Top:
  //           console.log("SS TOP")
  //           if(sn.position.x > dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("1")
  //             tx = sn.position.x - os
  //           } else if(sn.position.x < dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("2")
  //             tx = sn.position.x + sn.size.width + os
  //           } else if(sn.position.x > dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("3")
  //             tx = dn.position.x + dn.size.width + os
  //           } else if(sn.position.x < dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("4")
  //             tx = dn.position.x - os
  //           } else {
  //             console.log("5")
  //             tx = ie.bottomright.x + os
  //           }
  //           p3.x = tx
  //           p3.y = p2.y
  //           p4.x = p3.x
  //           p4.y = p5.y
  //           break 
  //         case EdgeSide.Bottom:
  //           console.log("SS BOTTOM")
  //           if(sn.position.x > dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("1")
  //             tx = dn.position.x + dn.size.width + os
  //           } else if(sn.position.x < dn.position.x && sn.position.y < dn.position.y)  {
  //             console.log("2")
  //             tx = dn.position.x - os //sn.position.x + sn.size.width + 20
  //           } else if(sn.position.x > dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("3")
  //             tx = sn.position.x - os
  //           } else if(sn.position.x < dn.position.x && sn.position.y > dn.position.y)  {
  //             console.log("4")
  //             tx = sn.position.x + sn.size.width + os
  //           } 
  //           p3.x = tx
  //           p3.y = p2.y
  //           p4.x = p3.x
  //           p4.y = p5.y 
  //           break
  //       }

  //       console.log(p1,p2,p3,p4,p5,p6)
  //       return [p1,p2,p3,p4,p5,p6]
  //     } else if(vg <= gap && (ss === EdgeSide.Left || ss == EdgeSide.Right)) { 
  //       // 3b, 5 segments
  //     } else {
  //       // 3c, 3 segments 
  //     }
  //     // if((ss ===  EdgeSide.Top && ds === EdgeSide.Bottom) || (ss ===  EdgeSide.Bottom && ds === EdgeSide.Top) ) {
  //     //   console.log('OP0: ', sn, dn, hg, vg)
  //     //   if(ss === EdgeSide.Bottom && sn.position.y >= dn.position.y) { //ss equal or above dc
  //     //     console.log('OP1:')
  //     //     if(hg < 25) {
  //     //       console.log('OP1a')  
  //     //       let e:Extent = this.getNodeExtents(sn, dn)
  //     //       return [p1, p2, {x: e.bottomright.x +20, y: p2.y}, {x: e.bottomright.x +20, y: p5.y}, p5, p6]
  //     //     } else {
  //     //       console.log('OP1b')  
  //     //       return [p1, p2, {x: p2.x + ((p6.x - p2.x)/2), y: p2.y}, {x: p2.x + ((p6.x - p2.x)/2), y: p5.y}, p5, p6]
  //     //     }
  //     //   } else if(ss === EdgeSide.Bottom && sn.position.y + sa.position.y + 25 < dn.position.y) { 
  //     //     console.log('OP2')
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     return [p1, 
  //     //       {x:p1.x, y: sn.position.y + sn.size.height + ((dn.position.y - (sn.position.y + sn.size.height))/2)}, 
  //     //       {x:p6.x, y: sn.position.y + sn.size.height + ((dn.position.y - (sn.position.y + sn.size.height))/2)}, 
  //     //     p6]
  //     //   } else if(ss === EdgeSide.Bottom && sn.position.y === dn.position.y) { 
  //     //     console.log('OP3')
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     let splitX:number = (sn.position.x + sn.size.width) < dn.position.x 
  //     //       ? sn.position.x + sn.size.width + (dn.position.x - (sn.position.x + sn.size.width))/2 
  //     //       : (dn.position.x + dn.size.width) < sn.position.x 
  //     //         ? dn.position.x + dn.size.width + (sn.position.x - (dn.position.x + dn.size.width))/2 
  //     //         : e.topleft.x + ((e.bottomright.x - e.topleft.x)/2) 
  //     //     return [p1,
  //     //       {x:p1.x, y:e.bottomright.y + 25}, 
  //     //       {x:splitX, y: e.bottomright.y + 25},
  //     //       {x:splitX, y: e.topleft.y - 25},
  //     //       {x:p6.x, y: e.topleft.y - 25},
  //     //     p6]
  //     //   } else if(ss === EdgeSide.Top && sn.position.y >= dn.position.y) {
  //     //     console.log('OP4')
  //     //     //if(hg < 25) {
  //     //       let e:Extent = this.getNodeExtents(sn, dn)
  //     //     return [p1,
  //     //       {x:p1.x, y:e.bottomright.y + 25}, 
  //     //       {x:e.bottomright.x + 25, y: e.bottomright.y + 25},
  //     //       {x:e.bottomright.x + 25, y: e.topleft.y - 25},
  //     //       {x:p6.x, y: e.topleft.y - 25},
  //     //     p6]
  //     //     // } else {
  //     //       // return [p1, {x:p1.x ,y:(p1.y + p6.y)/2 }, {x:p6.x ,y:(p1.y + p6.y)/2}, p6]
  //     //     // }
          
  //     //   } else if(ss === EdgeSide.Top && sn.position.y < dn.position.y) { 
  //     //     console.log('OP5')
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     return [p1, 
  //     //       {x:p1.x, y:e.topleft.y - 25}, 
  //     //       {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
  //     //       {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
  //     //       {x:p1.x, y:e.bottomright.y + 25},
  //     //     p6]
  //     //   } else if(ss === EdgeSide.Top && sn.position.y === dn.position.y) { 
  //     //     console.log('OP6')
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     let splitX:number = (sn.position.x + sn.size.width) < dn.position.x 
  //     //       ? sn.position.x + sn.size.width + (dn.position.x - (sn.position.x + sn.size.width))/2 
  //     //       : (dn.position.x + dn.size.width) < sn.position.x 
  //     //         ? dn.position.x + dn.size.width + (sn.position.x - (dn.position.x + dn.size.width))/2 
  //     //         : e.topleft.x + ((e.bottomright.x - e.topleft.x)/2) 
  //     //     return [p1,
  //     //       {x:p1.x, y:e.bottomright.y + 25}, 
  //     //       {x:splitX, y: e.bottomright.y + 25},
  //     //       {x:splitX, y: e.topleft.y - 25},
  //     //       {x:p6.x, y: e.topleft.y - 25},
  //     //     p6]
  //     //   } else {
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     return [p1,
  //     //       {x:p1.x, y:e.bottomright.y + 25}, 
  //     //       {x:e.bottomright.x + 25, y: e.bottomright.y + 25},
  //     //       {x:e.bottomright.x + 25, y: e.topleft.y - 25},
  //     //       {x:p6.x, y: e.topleft.y - 25},
  //     //     p6]
  //     //   }
  //     // }
  //     // else if((ss === EdgeSide.Left && ds === EdgeSide.Right) || (ss === EdgeSide.Right && ds === EdgeSide.Left)) { // <<<<< OPPOSITE SIDES
  //     //   if(ss === EdgeSide.Right && sn.position.x > dn.position.x) {  // <<<<<< start side is right and start node is to the right of destination
  //     //     return [p1, {x:(p1.x + p6.x)/2 ,y:p1.y}, {x:(p1.x + p6.x)/2,y:p6.y }, p6]
  //     //   } else if(ss === EdgeSide.Left && sn.position.y < dn.position.y) {   // <<<<< start side is t
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     return [p1, 
  //     //       {x:e.bottomright.x + 25, y:p1.y}, 
  //     //       {x:e.bottomright.x + 25, y: e.bottomright.y + 25}, 
  //     //       {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
  //     //       {x:e.topleft.x -25, y:p6.y},
  //     //     p6]
  //     //   } else if(ss === EdgeSide.Right && sn.position.x === dn.position.x) { 
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     let splitY:number = (sn.position.x + sn.size.width) < dn.position.x 
  //     //       ? sn.position.x + sn.size.width + (dn.position.x - (sn.position.x + sn.size.width))/2 
  //     //       : (dn.position.x + dn.size.width) < sn.position.x 
  //     //         ? dn.position.x + dn.size.width + (sn.position.x - (dn.position.x + dn.size.width))/2 
  //     //         : e.topleft.x + ((e.bottomright.x - e.topleft.x)/2) 
  //     //     return [p1,
  //     //       {x:p1.x, y:e.bottomright.y + 25}, 
  //     //       {x:e.bottomright.x + 25, y: splitY},
  //     //       {x:e.topleft.x - 25, y: splitY},
  //     //       {x:p6.x, y: e.topleft.y - 25},
  //     //     p6]
  //     //   } else if(ss === EdgeSide.Left && sn.position.y > dn.position.y) {
  //     //     return [p1, {x:p1.x ,y:(p1.y + p6.y)/2 }, {x:p6.x ,y:(p1.y + p6.y)/2}, p6]
  //     //   } else if(ss === EdgeSide.Left && sn.position.y < dn.position.y) { 
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     return [p1, 
  //     //       {x:p1.x, y:e.topleft.y - 25}, 
  //     //       {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
  //     //       {x:e.topleft.x - 25, y: e.bottomright.y + 25}, 
  //     //       {x:p1.x, y:e.bottomright.y + 25},
  //     //     p6]
  //     //   } else if(ss === EdgeSide.Right && sn.position.y === dn.position.y) { 
  //     //     let e:Extent = this.getNodeExtents(sn, dn)
  //     //     let splitY:number = (sn.position.y + sn.size.height) < dn.position.y 
  //     //       ? sn.position.y + sn.size.height+ (dn.position.y - (sn.position.y + sn.size.height))/2 
  //     //       : (dn.position.y + dn.size.height) < sn.position.y 
  //     //         ? dn.position.y + dn.size.height + (sn.position.y - (dn.position.y + dn.size.height))/2 
  //     //         : e.topleft.y + ((e.bottomright.y - e.topleft.y)/2) 
  //     //     return [p1,
  //     //       {x:p1.x, y:e.bottomright.y + 25}, 
  //     //       {x:e.bottomright.x + 25, y: splitY},
  //     //       {x:e.topleft.y - 25, y: splitY},
  //     //       {x:p6.x, y: e.topleft.y - 25},
  //     //     p6]
  //     //   }
  //     // }
  //   } else if(ss + 3 === ds || (ss + 3 ) % 4 === ds ) { //////////////////////////////////////// CCW

  //   }
  //   // switch(ss) {
  //   //   case EdgeSide.Top:
  //   //     switch(ds) {
  //   //       case EdgeSide.Top:
  //   //         break
  //   //       case EdgeSide.Right:
  //   //         break
  //   //       case EdgeSide.Bottom:
  //   //         break
  //   //       case EdgeSide.Left:
  //   //         break
  //   //     }
  //   //     break
  //   //   case EdgeSide.Right:
  //   //     switch(ds) {
  //   //       case EdgeSide.Top:
  //   //         break
  //   //       case EdgeSide.Right:
  //   //         break
  //   //       case EdgeSide.Bottom:
  //   //         break
  //   //       case EdgeSide.Left:
  //   //         break
  //   //     }
  //   //     break
  //   //   case EdgeSide.Bottom:
  //   //     switch(ds) {
  //   //       case EdgeSide.Top:
  //   //         break
  //   //       case EdgeSide.Right:
  //   //         break
  //   //       case EdgeSide.Bottom:
  //   //         break
  //   //       case EdgeSide.Left:
  //   //         break
  //   //     }
  //   //     break
  //   //   case EdgeSide.Left:
  //   //     switch(ds) {
  //   //       case EdgeSide.Top:
  //   //         break
  //   //       case EdgeSide.Right:
  //   //         break
  //   //       case EdgeSide.Bottom:
  //   //         break
  //   //       case EdgeSide.Left:
  //   //         break
  //   //     }
  //   //     break
  //   // }
  //   // console.log('blow by')
     return [p1, p2]
   }

  // getPathModel = (ss:EdgeSide, ds:EdgeSide) => {
  //   if(ss === ds) {

  //   } else if(ss + 1 === ds || (ss + 1 ) % 4 === ds ) {

  //   } else if(ss + 2 === ds || (ss + 2 ) % 4 === ds ) {

  //   } else if(ss + 3 === ds || (ss + 3 ) % 4 === ds ) {

  //   }
  // }

  // getFiveSegmentLayout = (ss:EdgeSide, ds:EdgeSide):string => {
  //   if(ss === ds) { return "SS" } 
  //   else if(ss +2 === ds || ss -2 === ds) { return "OS" }
  //   else if( ss + 1 === ds || ss === 4 && ds === 1 ) { return "CW" }
  //   else if( ss + 1 === ds || ss === 1 && ds === 4 ) { return "CCW" }
  //   return "Unknown"
  // }
  
  isCloser = (a1:number, a2:number, b1:number, b2:number):string => {
    const d1 = Math.abs(a2-a1)
    const d2 = Math.abs(b2-b1)
    return d2 < d1 ? "closer" : d2 > d1 ? "farther" : "equal"   
  }
    
  getLateralGap = (sn:NodeDisplayInstance, dn:NodeDisplayInstance, dir:String):number => {
    let ie:Extent = this.getNodeExtents(sn, dn)
    let r:number = 0
    if(dir === "H") {
      if(sn.position.x === ie.topleft.x) {
        console.log("SN is left")
        r = dn.position.x - (sn.position.x + sn.size.width)
      } else {
        console.log("DN is left")
        r = sn.position.x - (dn.position.x + dn.size.width)
      }
    } else {
      if(sn.position.y === ie.topleft.y) {
        console.log("SN is Top")
        r =  dn.position.y - (sn.position.y + sn.size.height)
      } else {
        console.log("DN is Top")
        r =  sn.position.y - (dn.position.y + dn.size.height)
      }
    }

    return r < 0 ? 0 :r
  }

  hasHorizontalGap =  (sn:NodeDisplayInstance, dn:NodeDisplayInstance, gap:number):boolean => {
    if(sn.position.x < dn.position.x) {
      return sn.position.x + sn.size.width + gap < dn.position.x ? true : false
    } else {
      return dn.position.x + sn.size.width + gap < sn.position.x ? true : false
    }
  }

  hasVerticalGap =  (sn:NodeDisplayInstance, dn:NodeDisplayInstance, gap:number):boolean => {
    if(sn.position.y < dn.position.y) {
      return sn.position.y + sn.size.height + gap < dn.position.y ? true : false
    } else {
      return dn.position.y + sn.size.height + gap < sn.position.y ? true : false
    }
  }
  // hasVerticalGap = (sn:NodeDisplayInstance, dn:NodeDisplayInstance, ie:Extent) => {
  //   if(sn.size.height + dn.size.height + 40 <= ie.bottomright.y - ie.topleft.y) return true
  //   return false
  // }

  // hasHorizontalGap = (sn:NodeDisplayInstance, dn:NodeDisplayInstance, ie:Extent) => {
  //   if(sn.size.width + dn.size.width + 40 <= ie.bottomright.x - ie.topleft.x) return true
  //   return false
  // }

  getSlope = (p1:Position, p2:Position):number => {
    if(p1.x === p2.x && p1.y != p2.y) {
      return p1.y > p2.y ? 0 : 180
    } else if (p1.x != p2.x && p1.y === p2.y) {
      return p1.x > p2.x ? 170 : 90
    } else {
      return 180
    }
  }

  getEnumName = (enumObj:any, value:number):string => {
    // console.log(typeof enumObj, value)
    // for(var enumMember in enumObj) {
    //   var isValueProp = Number(enumMember) >= 0
    //   if( isValueProp && value === value) {
    //     return enumObj[enumMember]
    //   }
    // }

    // return "not found"
    // return Object.keys(enumObj).find((k, i)=>{
    //   console.log("Key:", enumObj[i], k, i, value)
    //   return enumObj[i]===value}) as string
    return Object.values(enumObj)[value] as string
  }


  // isOpposite = (ss:EdgeSide, ds:EdgeSide):boolean => {
  //   if(ss +2 === ds || ss -2 === ds) { return true }
  //   return false
  // }

  // isCW = (ss:EdgeSide, ds:EdgeSide):boolean => {
  // }

  // fixRoute = (sn:NodeDisplayInstance, dn: NodeDisplayInstance, e: IEdgeDisplayInstance):Array<Position> => {
  //   let isFixable:boolean=true;
  //   let tp:Array<Position> = []

  //   const sIsCorner:boolean = this.isCorner(sn, e.route[0])
  //   const dIsCorner:boolean = this.isCorner(dn, e.route[e.route.length -1])
  //   const sFace:number = this.getFace(sn, e.route[0], true, sIsCorner )
  //   const dFace:number = this.getFace(sn, e.route[0], false, dIsCorner )

  //   switch(e.style.layout) {
  //     case (EdgeLayout.Straight):
  //       let sa:NodeAnchor = sn.anchors.find((a)=>{ return a.id === e.edgeData.sourceAnchor}) as NodeAnchor
  //       let da:NodeAnchor = sn.anchors.find((a)=>{ return a.id === e.edgeData.destinationAnchor}) as NodeAnchor
  //       tp = [ {x:sa.position.x, y:sa.position.y, direction:EdgeDirection.None, percent:-1},{x:da.position.x, y:da.position.y, direction:EdgeDirection.None, percent:-1}]
  //       break;
  //     case (EdgeLayout.NinetyDegree), (EdgeLayout.Bezier): 
  //       let eFaces:number = this.getExpectedSegments(sn, dn, e, true);
        
  //       for(let i:number = 0; i < e.route.length; i++ ) {
          
  //       }
      
  //       break;
  //     case EdgeLayout.Bezier: 
  //        break;
  //   }

  //   if(!isFixable) {
  //     return this.autoRoute(sn, dn, e) as Position[]
  //   }
     
  //   return tp
  // }

  // getExpectedSegments = (sn:NodeDisplayInstance, dn:NodeDisplayInstance, e:IEdgeDisplayInstance, specifiedAnchor:boolean):number => {
  //   let r = 3;
  //   let sa:NodeAnchor | undefined = sn.anchors.find((a) => a.id === e.edgeData.sourceAnchor);
  //   let da:NodeAnchor | undefined = dn.anchors.find((a) => a.id === e.edgeData.sourceAnchor);

  //   if(specifiedAnchor) {
  //     if(sa && da) {
  //       let dx:number = -sn.position.x + dn.position.x
  //       let dy:number = -sn.position.y + dn.position.y
        
  //     }
  //   } else {
  //     let dx:number = 0;
  //     let dy:number = 0;
     
  //   }

  //   return r;
  // }

  // autoRoute = (sn: NodeDisplayInstance, dn: NodeDisplayInstance, e: IEdgeDisplayInstance):Array<Position> => {
  //   let r:Array<Position> = []
  //   switch(e.style.layout) {
  //     case (EdgeLayout.Straight):
  //       const sIsCorner:boolean = this.isCorner(sn, e.route[0])
  //       const dIsCorner:boolean = this.isCorner(dn, e.route[e.route.length -1])
  //       const sFace:number = this.getFace(sn, e.route[0], true, sIsCorner )
  //       const dFace:number = this.getFace(sn, e.route[0], false, dIsCorner )

  //       for(let i:number = 0; i < e.route.length; i++ ) {
          
  //       }
  //       break;
  //     case (EdgeLayout.NinetyDegree): 

  //       break;
  //     case (EdgeLayout.Bezier):
  //       break;
  //   }
  //   return r
  // }

  // getStartNodeAnchor = (e:IEdgeDisplayInstance, ns:Array<NodeDisplayInstance>):NodeAnchor => {
  //   let n = ns.find((o) => { return o.id = e.edgeData.sourceObject})
  //   let a:NodeAnchor =  {
  //     id: 'none',
  //     position: {x:-1, y:-1, direction:EdgeDirection.None, percent:-1},
  //     status: -1,
  //     edges:[]
  //   }
  //   if(n) {
  //     a = n.anchors.find((ap) => {return ap.id === e.edgeData.sourceAnchor}) as NodeAnchor
  //     if(!a) {
  //       a = {
  //         id: 'none',
  //         position: {x:-1, y:-1, direction:EdgeDirection.None, percent:-1},
  //         status: -1,
  //         edges:[]
  //       }
  //     }
  //   }
  //   return a
  // }

  // getEndNodeAnchor = (e:IEdgeDisplayInstance, ns:Array<NodeDisplayInstance>):NodeAnchor => {
  //   let n = ns.find((o) => { return o.id = e.edgeData.destinationObject})
  //   let a:NodeAnchor =  {
  //     id: 'none',
  //     position: {x:-1, y:-1, direction:EdgeDirection.None, percent:-1},
  //     status: -1,
  //     edges:[]
  //   }
  //   if(n) {
  //     a = n.anchors.find((ap) => {return ap.id === e.edgeData.destinationAnchor}) as NodeAnchor
  //     if(!a) {
  //       a = {
  //         id: 'none',
  //         position: {x:-1, y:-1, direction:EdgeDirection.None, percent:-1},
  //         status: -1,
  //         edges:[]
  //       }
  //     }
  //   }
  //   return a
  // }

  // isCorner = (n:NodeDisplayInstance, p:Position):boolean => {
  //   if((p.x === 0 && p.y === 0) || 
  //      (p.x === 0 && p.y === n.nodeData.dimensions.height) || 
  //      (p.x === n.nodeData.dimensions.width && p.y === 0 ) || 
  //      (n.nodeData.dimensions.width && p.y === n.nodeData.dimensions.height)) {
  //     return true;
  //   }
  //   return false;
  // }

  // getFace = (n:NodeDisplayInstance, p:Position, isStart:boolean, isCorner:boolean):number => {
  //   if(p.x === 0) { 
  //     if(!isStart && isCorner && p.y === 0) {
  //       return NodeFace.top;
  //     }
  //     else if(isStart && isCorner && p.y === n.nodeData.dimensions.height) {
  //       return NodeFace.bottom
  //     } 
  //     else {
  //       return NodeFace.left
  //     }
  //   }
  //   else if(p.x === n.nodeData.dimensions.width) {
  //     if(!isStart && isCorner && p.y === 0) {
  //       return NodeFace.top
  //     }
  //     else if(isStart && isCorner && p.y === n.nodeData.dimensions.height) {
  //       return NodeFace.bottom
  //     }
  //     else {
  //       return NodeFace.right
  //     }
  //   }
  //   else if(p.y === 0){
  //     return NodeFace.top
  //   }
  //   else {
  //     return NodeFace.left
  //   }
  // }

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
