import React from 'react';
import './App.css';


import WorkflowDiagram from './FacilityDocumentFlow';
import FacilityDocumentFlow from './FacilityDoc';
import EnhancedFacilityDocumentFlow from './FacilityFlowImp';

function App() {
  return (
    <div className="App">
      <h1>Facility Document Flow</h1>
      <div style={{ width: '100%', height: '800px' }}>
        <EnhancedFacilityDocumentFlow />
      </div>
    </div>
  );
}

export default App;