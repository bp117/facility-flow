import React, { useState, useEffect } from "react";
import ReactFlow, {
Controls,
Background,
MarkerType,
Panel
} from "reactflow";
import "reactflow/dist/style.css";

const EnhancedFacilityDocumentFlow = () => {
// Define node types with colors
const nodeTypes = {
  input: "#d0e0ff",
  processing: "#c2f0c2",
  api: "#ffd0d0",
  ai: "#e0d0ff",
  decision: "#ffe6cc",
  output: "#d0f0ff",
  external: "#ffd0d0", // Light red for external/AI operations
  internal: "#c2f0c2"  // Light green for internal processing
};

// State for UI controls
const [isPlaying, setIsPlaying] = useState(false);
const [currentStep, setCurrentStep] = useState(0);
const [processingNode, setProcessingNode] = useState(null);
const [processedNodes, setProcessedNodes] = useState([]);
const [statusMessage, setStatusMessage] = useState("Ready to start");
const [speed, setSpeed] = useState(1000);
// Add after other state declarations
const [extractedValues, setExtractedValues] = useState({
  obligor_name: "WEST 30TH STREET LLC",
  current_value_basis: "As Is",
  current_value: "130900000"
});
// Element data being processed
const [elementData, setElementData] = useState({
  facility_id: "IQ0015810070003629HFI",
  current_element: "None",
  dependent_elements: "None", 
  docs_found: 0,
  doc_types_used: [],
  relevant_docs: []
});
// Add after other state declarations
const [processedElements, setProcessedElements] = useState([]);

// Mock document data based on the spreadsheet
const [documentData, setDocumentData] = useState([
  {id: 1, name: "IQ0015810070003629HFI_LAR - Origination.pdf", type: "Operating Income Statement"},
  {id: 2, name: "IQ0015810070003629HFI_1020465_Acquisition Loan Note -2021.11.04.pdf", type: "Note"},
  {id: 3, name: "IQ0015810070003629HFI_1020465_Building Loan Agreement - 2021.11.04.pdf", type: "Credit - Loan Agreement"},
  {id: 4, name: "IQ0015810070003629HFI_ART As of Sample Date.pdf", type: "Risk Rating"},
  {id: 5, name: "IQ0015810070003629HFI_Credit Agreement_dtd 12022021.pdf", type: "Credit - Loan Agreement"},
  {id: 6, name: "IQ0015810070003629HFI_Note_dtd 12022021.pdf", type: "Note"},
  {id: 7, name: "IQ0015810070003629HFI_Security Instrument_dtd 12022021.pdf", type: "Note"},
  {id: 8, name: "IQ0015810070003629HFI_West 30th REVS Appraisal Review.pdf", type: "Appraisal Desk Review"},
  {id: 9, name: "IQ0015810070003629HFI_West 30th Appraisal.pdf", type: "Appraisal Desk Review"},
  {id: 10, name: "IQ0015810070003629HFI_Rent Roll.pdf", type: "Rent Roll"}
]);

// Mock elements data based on the spreadsheet
const [elementsData, setElementsData] = useState([
  {id: 1, name: "obligor_name", order: 1, depends_on: "None", priority_docs: [
    {type: "Know Your Customer", priority: 1},
    {type: "Credit - Loan Agreement", priority: 2}
  ]},
  {id: 2, name: "current_value_basis", order: 2, depends_on: "1", priority_docs: [
    {type: "Financial Statement", priority: 1},
    {type: "Appraisal Report", priority: 2},
    {type: "Appraisal Desk Review", priority: 3},
    {type: "Credit Approval", priority: 4}
  ]},
  {id: 3, name: "current_value", order: 3, depends_on: "1,2", priority_docs: [
    {type: "Credit Report", priority: 1},
    {type: "Appraisal Report", priority: 2},
    {type: "Appraisal Desk Review", priority: 3},
    {type: "Credit Approval", priority: 4}
  ]}
]);


// Define nodes with a more detailed structure
const [nodes, setNodes] = useState([
  {
    id: "1",
    type: "default",
    position: { x: 400, y: 50 },
    data: { 
      label: "Input Facility ID",
      details: "User provides facility ID to begin document processing"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.7
    }
  },
  {
    id: "2",
    type: "default",
    position: { x: 400, y: 200 },
    data: { 
      label: "Read Documents Metadata",
      details: "Get document list from Excel with doc_name and doc_type"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "3",
    type: "default",
    position: { x: 400, y: 350 },
    data: { 
      label: "Retrieve Documents from ICMP",
      details: "Fetch all documents using ICMP API"
    },
    style: { 
      background: nodeTypes.ai, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "4",
    type: "default",
    position: { x: 400, y: 500 },
    data: { 
      label: "Determine Document Dates",
      details: "Use AI to extract dates from all documents"
    },
    style: { 
      background: nodeTypes.ai, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "5",
    type: "default",
    position: { x: 400, y: 650 },
    data: { 
      label: "Order Elements by Dependency",
      details: "Process independent elements first"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "6",
    type: "default",
    position: { x: 400, y: 800 },
    data: { 
      label: "Select Next Element",
      details: "Choose next element based on dependency order"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "7",
    type: "default",
    position: { x: 400, y: 950 },
    data: { 
      label: "Identify Candidate Doc Types",
      details: "Find document types relevant for current element"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "8",
    type: "default",
    position: { x: 400, y: 1100 },
    data: { 
      label: "Filter Latest/Earliest Docs",
      details: "Select latest or earliest document of each type"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "9",
    type: "default",
    position: { x: 400, y: 1250 },
    data: { 
      label: "Extract Element Value",
      details: "Extract data for current element from filtered docs"
    },
    style: { 
      background: nodeTypes.ai, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "10",
    type: "default", 
    position: { x: 400, y: 1400 },
    data: { 
      label: "Prioritize Extracted Data",
      details: "Choose final value based on document type priority"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "11",
    type: "default",
    position: { x: 75, y: 1250 }, // Changed from x: 850
    data: { 
      label: "Handle Dependencies",
      details: "Replace dependent elements in prompt if needed"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px",
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  },
  {
    id: "12",
    type: "default",
    position: { x: 1050, y: 800 },
    data: { 
      label: "More Elements?",
      details: "Check if there are more elements to process"
    },
    style: { 
      background: nodeTypes.internal,
      border: "1px solid #333",
      width: 180,
      height: 100,
      borderRadius: "10px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5
    },

  },
  {
    id: "13",
    type: "default",
    position: { x: 400, y: 1550 },
    data: { 
      label: "Generate Comparison Report",
      details: "Compare extracted values with expected values"
    },
    style: { 
      background: nodeTypes.internal, 
      border: "1px solid #333", 
      width: 180, 
      height: 100, 
      borderRadius: "10px", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      opacity: 0.5 
    }
  }
]);

// Define edges with meaningful labels
const [edges, setEdges] = useState([
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: false,
    label: "Facility ID",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: false,
    label: "Document Metadata",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: false,
    label: "Raw Documents",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    animated: false,
    label: "Documents with Dates",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    animated: false,
    label: "Ordered Elements",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e6-7",
    source: "6",
    target: "7",
    animated: false,
    label: "Current Element",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e7-8",
    source: "7",
    target: "8",
    animated: false,
    label: "Candidate Doc Types",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e8-9",
    source: "8",
    target: "9",
    animated: false,
    label: "Filtered Documents",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e9-10",
    source: "9",
    target: "10",
    animated: false,
    label: "Raw Values",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true
  },
  {
    id: "e9-11",
    source: "9",
    target: "11",
    animated: false,
    label: "If has dependencies",
    labelStyle: { fill: '#e67e00', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#ff9900", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#ff9900" },
    hidden: true
  },
  {
    id: "e11-10",
    source: "11",
    target: "10",
    animated: false,
    label: "With dependent values",
    labelStyle: { fill: '#e67e00', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#ff9900", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#ff9900" },
    hidden: true
  },
  {
    id: "e10-12",
    source: "10",
    target: "12",
    animated: false,
    label: "Final Element Value",
    labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true,
    type: 'smoothstep',
    sourceHandle: 'right',
    targetHandle: 'right'
  },
  {
    id: "e12-6",
    source: "12",
    target: "6",
    animated: false,
    label: "Yes - Process Next",
    labelStyle: { fill: '#0077b3', fontWeight: 'bold', fontSize: 12 },
    style: { stroke: "#0088cc", strokeWidth: 2, strokeDasharray: "5,5" },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#0088cc" },
    hidden: true,
        // Add edge routing
        type: 'smoothstep',
        sourceHandle: 'left',
        targetHandle: 'right',
        data: {
          path: [
            { x: 750, y: 800 },  // Start from More Elements left side
            { x: 600, y: 750 },  // Control point above target
            { x: 500, y: 800 }   // End at Select Next Element right side
          ]
        }
  },
  {
    id: "e12-13",
    source: "12",
    target: "13",
    animated: false,
    label: "No - All Done",
    labelStyle: { 
      fill: '#333', 
      fontWeight: 'bold', 
      fontSize: 12,
      background: '#fff'
    },
    style: { stroke: "#999", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
    hidden: true,
    type: 'STRAIGHT',
    sourceHandle: 'right',
    targetHandle: 'BOTTOM',
      // Position label at midpoint
    zIndex: 1000
}
]);

// Process steps for animation
const processSteps = [
  // Step 0: Start with facility ID
  {
    nodeId: "1",
    message: "Input facility ID to begin processing",
    action: () => {
      updateNodeStyle("1", { opacity: 1, border: "2px solid red" });
      setElementData({
        ...elementData,
        facility_id: "IQ0015810070003629HFI"
      });
    }
  },
  // Step 1: Read documents metadata from Excel
  {
    nodeId: "2",
    message: "Reading document metadata from Excel file",
    action: () => {
      updateNodeStyle("1", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("2", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e1-2", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      setElementData(prev => ({
        ...prev,
        docs_found: documentData.length
      }));
    }
  },
  // Step 2: Retrieve documents from ICMP API
  {
    nodeId: "3",
    message: "Retrieving documents from ICMP API",
    action: () => {
      updateNodeStyle("2", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("3", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e2-3", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 3: Determine document dates using AI
  {
    nodeId: "4",
    message: "Using AI to determine document dates",
    action: () => {
      updateNodeStyle("3", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("4", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e3-4", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 4: Order elements by dependency
  {
    nodeId: "5",
    message: "Ordering elements by dependency: obligor_name first (no dependencies)",
    action: () => {
      updateNodeStyle("4", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("5", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e4-5", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 5: Select first element
// Update steps where element changes (e.g., Step 5, 11, 18):
{
  nodeId: "6",
  message: "Selecting first element: obligor_name",
  action: () => {
    const currentElement = "obligor_name";
    updateNodeStyle("5", { opacity: 0.8, border: "2px solid green" });
    updateNodeStyle("6", { opacity: 1, border: "2px solid red" });
    updateEdgeStyle("e5-6", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    const relevantDocs = getRelevantDocs(currentElement);
    setElementData(prev => ({
      ...prev,
      current_element: currentElement,
      dependent_elements: "None",
      relevant_docs: relevantDocs,
      docs_found: relevantDocs.length
    }));
  }
},
  // Step 6: Identify candidate doc types
  {
    nodeId: "7",
    message: "Identifying document types for obligor_name: KYC, Credit - Loan Agreement",
    action: () => {
      updateNodeStyle("6", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("7", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e6-7", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      setElementData({
        ...elementData,
        doc_types_used: ["Know Your Customer", "Credit - Loan Agreement"]
      });
    }
  },
  // Step 7: Filter latest/earliest documents
  {
    nodeId: "8",
    message: "Filtering for latest documents of each type",
    action: () => {
      updateNodeStyle("7", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("8", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e7-8", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 8: Extract element value
  // Update the action in Step 9 (Extract element value)
  {
    nodeId: "9",
    message: "Extracting obligor_name from filtered documents",
    action: () => {
      updateNodeStyle("8", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("9", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e8-9", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      // Add value extraction simulation
      if (elementData.current_element === "obligor_name") {
        setExtractedValues(prev => ({
          ...prev,
          obligor_name: "WEST 30TH STREET LLC"
        }));
      }
    }
  },
  
  // Update similar extraction steps for other elements
  // For current_value_basis (Step 14):
  {
    nodeId: "9",
    message: "Extracting current_value_basis from filtered documents",
    action: () => {
      updateNodeStyle("8", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("9", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e8-9", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      setExtractedValues(prev => ({
        ...prev,
        current_value_basis: "As Is"
      }));
    }
  },
  
  // For current_value (Step 21):
  {
    nodeId: "9",
    message: "Extracting current_value from filtered documents",
    action: () => {
      updateNodeStyle("8", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("9", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e8-9", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      setExtractedValues(prev => ({
        ...prev,
        current_value: "130900000"
      }));
    }
  },
  // Step 9: Skip dependency handling for obligor_name
  {
    nodeId: "10",
    message: "No dependency handling needed for obligor_name",
    action: () => {
      updateNodeStyle("9", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("10", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e9-10", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 10: Prioritize data
  {
    nodeId: "12",
    message: "Prioritizing extracted data based on document type priority",
    action: () => {
      updateNodeStyle("10", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("12", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e10-12", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      setProcessedElements(prev => [...prev, "obligor_name"]);
    }
  },
  // Step 11: Check for more elements
  {
    nodeId: "6",
    message: "More elements to process - selecting current_value_basis",
    action: () => {
      updateNodeStyle("12", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("6", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e12-6", { hidden: false, animated: true, stroke: "blue", strokeWidth: 2 });
      setElementData({
        ...elementData,
        current_element: "current_value_basis",
        dependent_elements: "obligor_name",
        doc_types_used: []
      });
    }
  },
  // Step 12: Identify candidate doc types for second element
  {
    nodeId: "7",
    message: "Identifying document types for current_value_basis",
    action: () => {
      updateNodeStyle("6", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("7", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e6-7", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      setElementData({
        ...elementData,
        doc_types_used: ["Financial Statement", "Appraisal Report", "Appraisal Desk Review", "Credit Approval"]
      });
    }
  },
  // Step 13: Filter latest/earliest documents again
  {
    nodeId: "8",
    message: "Filtering for latest documents of each type",
    action: () => {
      updateNodeStyle("7", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("8", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e7-8", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 14: Extract element value again
  {
    nodeId: "9",
    message: "Extracting current_value_basis from filtered documents",
    action: () => {
      updateNodeStyle("8", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("9", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e8-9", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 15: Handle dependencies for second element
  {
    nodeId: "11",
    message: "Handling dependency: replacing obligor_name in prompts",
    action: () => {
      updateNodeStyle("9", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("11", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e9-11", { hidden: false, animated: true, stroke: "orange", strokeWidth: 2 });
    }
  },
  // Step 16: Prioritize data for second element
  {
    nodeId: "10",
    message: "Prioritizing extracted data with dependent values",
    action: () => {
      updateNodeStyle("11", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("10", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e11-10", { hidden: false, animated: true, stroke: "orange", strokeWidth: 2 });
      setProcessedElements(prev => [...prev, "current_value_basis"]);
    }
  },
  // Step 17: Check for more elements again
  {
    nodeId: "12",
    message: "Checking if more elements to process",
    action: () => {
      updateNodeStyle("10", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("12", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e10-12", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 18: Process third element
  {
    nodeId: "6",
    message: "More elements to process - selecting current_value",
    action: () => {
      updateNodeStyle("12", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("6", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e12-6", { hidden: false, animated: true, stroke: "blue", strokeWidth: 2 });
      setElementData({
        ...elementData,
        current_element: "current_value",
        dependent_elements: "obligor_name, current_value_basis",
        doc_types_used: []
      });
    }
  },
  // Step 19: Identify candidate doc types for third element
  {
    nodeId: "7",
    message: "Identifying document types for current_value",
    action: () => {
      updateNodeStyle("6", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("7", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e6-7", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      setElementData({
        ...elementData,
        doc_types_used: ["Credit Report", "Appraisal Report", "Appraisal Desk Review", "Credit Approval"]
      });
    }
  },
  // Step 20: Filter latest/earliest documents for third element
  {
    nodeId: "8",
    message: "Filtering for latest documents of each type",
    action: () => {
      updateNodeStyle("7", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("8", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e7-8", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 21: Extract third element value
  {
    nodeId: "9",
    message: "Extracting current_value from filtered documents",
    action: () => {
      updateNodeStyle("8", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("9", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e8-9", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 22: Handle dependencies for third element
  {
    nodeId: "11",
    message: "Handling dependencies: replacing obligor_name and current_value_basis in prompts",
    action: () => {
      updateNodeStyle("9", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("11", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e9-11", { hidden: false, animated: true, stroke: "orange", strokeWidth: 2 });
    }
  },
  // Step 23: Prioritize data for third element
  {
    nodeId: "10",
    message: "Prioritizing extracted data with dependent values",
    action: () => {
      updateNodeStyle("11", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("10", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e11-10", { hidden: false, animated: true, stroke: "orange", strokeWidth: 2 });
      setProcessedElements(prev => [...prev, "current_value"]);
    }
  },
  // Step 24: Check for more elements final time
  {
    nodeId: "12",
    message: "Checking if more elements to process - none remaining",
    action: () => {
      updateNodeStyle("10", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("12", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e10-12", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
    }
  },
  // Step 25: Generate final report
  {
    nodeId: "13",
    message: "All elements processed - generating comparison report",
    action: () => {
      updateNodeStyle("12", { opacity: 0.8, border: "2px solid green" });
      updateNodeStyle("13", { opacity: 1, border: "2px solid red" });
      updateEdgeStyle("e12-13", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      setIsPlaying(false);
    }
  }]
   // Helper function to update node styling
const updateNodeStyle = (id, styleUpdates) => {
  setNodes(prevNodes => 
    prevNodes.map(node => {
      if (node.id === id) {
        return { 
          ...node, 
          style: { 
            ...node.style, 
            ...styleUpdates,
            // Maintain rectangular shape
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 180,
            height: 100
          } 
        };
      }
      return node;
    })
  );
};

// Helper function to update edge styling
const getRelevantDocs = (element) => {
  if (!element || element === "None") return [];
  
  // Get priority doc types for current element
  const elementInfo = elementsData.find(e => e.name === element);
  if (!elementInfo) return [];
  
  const priorityDocTypes = elementInfo.priority_docs.map(p => p.type);
  
  // Filter documents that match the priority types
  return documentData.filter(doc => 
    priorityDocTypes.includes(doc.type)
  );
};
const updateEdgeStyle = (id, styleUpdates) => {
  setEdges(prevEdges => 
    prevEdges.map(edge => {
      if (edge.id === id) {
        return { 
          ...edge, 
          hidden: styleUpdates.hidden !== undefined ? styleUpdates.hidden : edge.hidden,
          animated: styleUpdates.animated !== undefined ? styleUpdates.animated : edge.animated,
          style: { 
            ...edge.style, 
            stroke: styleUpdates.stroke || edge.style.stroke,
            strokeWidth: styleUpdates.strokeWidth || edge.style.strokeWidth,
            strokeDasharray: styleUpdates.strokeDasharray || edge.style.strokeDasharray
          },
          markerEnd: {
            ...edge.markerEnd,
            color: styleUpdates.stroke || (edge.markerEnd ? edge.markerEnd.color : undefined),
            width: 25,
            height: 25
          },
          labelStyle: {
            ...edge.labelStyle,
            fill: styleUpdates.stroke === "red" ? "#cc0000" : 
                styleUpdates.stroke === "orange" ? "#e67e00" :
                styleUpdates.stroke === "blue" ? "#0077b3" : "#333"
          }
        };
      }
      return edge;
    })
  );
};

// Update the nextStep function:
const nextStep = () => {
  if (currentStep < processSteps.length) {
    const step = processSteps[currentStep];
    setProcessingNode(step.nodeId);
    setStatusMessage(step.message);
    step.action();
    // Update processed nodes using the current step's nodeId directly
    setProcessedNodes(prev => [...prev, step.nodeId]);
    setCurrentStep(prev => prev + 1);
  } else {
    setIsPlaying(false);
  }
};

// Reset the flow
const resetFlow = () => {
  // Reset all nodes to initial state
  setProcessedElements([]);
  setNodes(prevNodes => 
    prevNodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: node.id === "1" ? 1 : 0.5,
        border: node.id === "1" ? "2px solid red" : "1px solid #333"
      }
    }))
  );

  // Reset all edges to hidden
  setEdges(prevEdges => 
    prevEdges.map(edge => ({
      ...edge,
      hidden: true,
      animated: false,
      style: {
        ...edge.style,
        stroke: edge.id.includes("e9-11") || edge.id.includes("e11-10") ? "#ff9900" : 
                edge.id.includes("e12-6") ? "#0088cc" : "#999",
        strokeWidth: 1
      }
    }))
  );

  // Reset state
  setCurrentStep(0);
  setProcessingNode(null);
  setProcessedNodes([]);
  setStatusMessage("Ready to start");
  setElementData({
    facility_id: "IQ0015810070003629HFI",
    current_element: "None",
    dependent_elements: "None",
    docs_found: 0,
    doc_types_used: []
  });
  setIsPlaying(false);

  // Start from the beginning
  setTimeout(() => {
    nextStep();
  }, 500);
   // Reset extracted values
   setExtractedValues({
    obligor_name: "",
    current_value_basis: "",
    current_value: ""
  });
  
};

// Update the useEffect for auto-play:
useEffect(() => {
  let timer;
  if (isPlaying && currentStep < processSteps.length) {
    timer = setTimeout(() => {
      nextStep();
    }, speed);
  } else if (currentStep >= processSteps.length) {
    setIsPlaying(false);
  }
  return () => clearTimeout(timer);
}, [isPlaying, currentStep, speed]);

// Start the flow automatically on first render
// useEffect(() => {
//   if (currentStep === 0) {
//     nextStep();
//   }
// }, []);
useEffect(() => {
  if (elementData.current_element !== "None") {
    const relevantDocs = getRelevantDocs(elementData.current_element);
    setElementData(prev => ({
      ...prev,
      relevant_docs: relevantDocs,
      docs_found: relevantDocs.length
    }));
  }
}, [elementData.current_element]);
return (
  <div style={{ width: "100%", height: "1200px", border: "1px solid #ddd" }}>

    
    <div style={{ display: "flex", height: "calc(100% - 41px)" }}>
      {/* Main Flow Panel */}
      <div style={{ flex: "1", position: "relative" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          defaultZoom={0.8}
          maxZoom={1}
          minZoom={0.2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          preventScrolling={false}
         
        >
          <Background color="#f0f0f0" variant="dots" />
          <Controls showInteractive={false} />
          
  {/* Move Available Documents to left panel */}
  <Panel position="top-left" style={{ width: "280px" }}>
    <div style={{
      background: "white",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      marginBottom: "10px"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
        All Available Documents
      </div>
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Document Name</th>
              <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {documentData.map((doc) => (
              <tr key={doc.id}>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontSize: "10px", textAlign: "left" }}>
                  {doc.name.length > 25 ? doc.name.substring(0, 25) + "..." : doc.name}
                </td>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee", textAlign: "left" }}>{doc.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </Panel>
          
          {/* Legend */}
 
        </ReactFlow>
      </div>
      
      {/* Right Side Panels */}
      <div style={{ width: "400px", borderLeft: "1px solid #ddd", overflow: "auto", padding: "10px" }}>
      
      <div style={{
              background: "white",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginBottom: "10px"
            }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>Process Controls</div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: isPlaying ? "#f44336" : "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer"
                  }}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  onClick={nextStep}
                  disabled={isPlaying || currentStep >= processSteps.length}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: isPlaying || currentStep >= processSteps.length ? "#cccccc" : "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: isPlaying ? "not-allowed" : "pointer"
                  }}
                >
                  Next Step
                </button>
                <button
                  onClick={resetFlow}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#FF9800",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer"
                  }}
                >
                  Reset
                </button>
              </div>
              <div>
                <div style={{ marginBottom: "5px" }}>Speed:</div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span>Fast</span>
                  <span>Slow</span>
                </div>
              </div>
            </div>
      
        {/* Process Status */}
        <div style={{
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          marginBottom: "15px"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>Process Status</div>
          <div style={{ 
            padding: "8px", 
            backgroundColor: "#f0f8ff", 
            borderRadius: "3px", 
            marginBottom: "10px",
            borderLeft: "4px solid #2196F3"
          }}>
            {statusMessage}
          </div>
        </div>
        
        {/* Current Element Data */}
        <div style={{
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          marginBottom: "15px"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>Current Element Data</div>
          <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee", width: "40%" }}>Facility ID:</td>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{elementData.facility_id}</td>
              </tr>
              <tr>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>Current Element:</td>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{elementData.current_element}</td>
              </tr>
              <tr>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>Dependent On:</td>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{elementData.dependent_elements}</td>
              </tr>
              <tr>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>Docs Found:</td>
                <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{elementData.docs_found}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Document Types Used */}
        <div style={{
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          marginBottom: "15px"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>Document Types Used</div>
          {elementData.doc_types_used.length > 0 ? (
            <ol style={{ margin: "0", paddingLeft: "20px" }}>
              {elementData.doc_types_used.map((docType, index) => (
                <li key={index} style={{ marginBottom: "3px" , textAlign:'left'}}>{docType}</li>
              ))}
            </ol>
          ) : (
            <div style={{ fontStyle: "italic", color: "#666" }}>No document types selected</div>
          )}
        </div>
        
        {/* Available Documents */}
        {/* <div style={{
  background: "white",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  marginBottom: "15px"
}}>
  <div style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
    {elementData.current_element === "None" 
      ? "All Available Documents" 
      : `Relevant Documents for ${elementData.current_element}`}
  </div>
  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
    <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Document Name</th>
          <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Type</th>
        </tr>
      </thead>
      <tbody>
        {(elementData.current_element === "None" ? documentData : elementData.relevant_docs).map((doc) => (
          <tr key={doc.id}>
            <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontSize: "10px" }}>
              {doc.name.length > 25 ? doc.name.substring(0, 25) + "..." : doc.name}
            </td>
            <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>{doc.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div> */}

{/* Relevant Documents */}
{/* {elementData.current_element !== "None" && (
  <div style={{
    background: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    marginBottom: "15px"
  }}>
    <div style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
      Relevant Documents for {elementData.current_element}
    </div>
    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
      <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Document Name</th>
            <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Type</th>
          </tr>
        </thead>
        <tbody>
          {elementData.relevant_docs.map((doc) => (
            <tr key={doc.id}>
              <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontSize: "10px", textAlign: "left" }}>
                {doc.name.length > 25 ? doc.name.substring(0, 25) + "..." : doc.name}
              </td>
              <td style={{ padding: "3px", borderBottom: "1px solid #eee", textAlign: "left" }}>{doc.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}     */}

{/* Extracted Values */}
<div style={{
  background: "white",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  marginBottom: "15px"
}}>
  <div style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>
    Extracted Values
  </div>
  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
    <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Element</th>
          <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Value</th>
          <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(extractedValues).map(([element, value]) => (
          <tr key={element} style={{
            backgroundColor: elementData.current_element === element ? "#f0f8ff" : "transparent"
          }}>
            <td style={{ 
              padding: "3px", 
              borderBottom: "1px solid #eee",
              fontWeight: elementData.current_element === element ? "bold" : "normal"
            }}>
              {element}
            </td>
            <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>
              {processedElements.includes(element) ? value : (
                elementData.current_element === element ? 
                "Extracting..." : 
                "Not extracted"
              )}
            </td>
            <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>
              {processedElements.includes(element) ? (
                <span style={{ color: "green" }}>✓</span>
              ) : elementData.current_element === element ? (
                <span style={{ color: "orange" }}>Processing...</span>
              ) : (
                <span style={{ color: "gray" }}>Pending</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        {/* Elements Table */}
        <div style={{
          background: "white",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "5px", fontSize: "14px" }}>Elements Processing Order</div>
          <table style={{ width: "100%", fontSize: "11px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Element</th>
                <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Order</th>
                <th style={{ padding: "3px", borderBottom: "1px solid #ccc", textAlign: "left" }}>Depends On</th>
              </tr>
            </thead>
            <tbody>
              {elementsData.map((element) => (
                <tr key={element.id} style={{
                  backgroundColor: elementData.current_element === element.name ? "#f0f8ff" : "transparent"
                }}>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontWeight: elementData.current_element === element.name ? "bold" : "normal" }}>
                    {element.name}
                  </td>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>{element.order}</td>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>{element.depends_on}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
); 
}
export default EnhancedFacilityDocumentFlow ;
