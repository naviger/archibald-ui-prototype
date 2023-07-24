import { Canvas } from './modules/components/Canvas'
import { GetTestData } from './modules/data/TestData';
import './App.css';
import { IModel } from './modules/structure/Model';
import { EdgeLayout } from './modules/enums/enumEdgeLayout';
import { DefaultValues } from './modules/structure/DefaultValues';
import { EdgeRelationships } from './modules/enums/enumEdgeRelationships';

let d:IModel = GetTestData()

function App() {
  let defaults:DefaultValues = {
    edgeStyle: {
      weight: '1',
      color:'green',
      layout:EdgeLayout.Straight,
      style: '3 0'
    },
    edgeType: EdgeRelationships.Assignment
  }
  return (
    <div className="App">
      <header className="App-header">
        Naviger
      </header>
      <div className='body'>
        <Canvas modelData={d} defaults={defaults} ></Canvas>
      </div>
    </div>
  );
}

export default App;
