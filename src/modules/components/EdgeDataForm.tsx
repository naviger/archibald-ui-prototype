import { Edge } from "../structure/Edge"
import './EdgeDataForm.css'

export const EdgeDataRenderer = (props:Edge):JSX.Element => { 

  return (
    <div className="edge-data-frame inner-property-panel">
      <div className="edge-data-element">
        <div className="edge-data-label">ID</div>
        <div className="edge-data-value">{props.edgeId}</div>
      </div>
      <div className="edge-data-element">
        <div className="edge-data-label">Label</div>
        <div className="edge-data-value">{props.label}</div>
      </div>
      <div className="edge-data-element">
        <div className="edge-data-label">Type</div>
        <div className="edge-data-value">{props.type}</div>
      </div>
    </div>
  )
}