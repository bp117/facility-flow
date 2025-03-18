import React from 'react';
import './App.css';


import WorkflowDiagram from './FacilityDocumentFlow';
import FacilityDocumentFlow from './FacilityDoc';

function App() {
  return (
    <div className="App">
      <h1>Facility Document Flow</h1>
      <div style={{ width: '100%', height: '800px' }}>
        <FacilityDocumentFlow />
      </div>
    </div>
  );
}

export default App;