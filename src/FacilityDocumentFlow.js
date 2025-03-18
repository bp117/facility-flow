import React, { useState, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  MarkerType,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";

// This implements a horizontal hierarchical flow layout with edge labels
// containing the output of each process step

const FacilityDocumentFlow = () => {
  // Define node types with colors
  const nodeTypes = {
    input: "#d0e0ff",
    processing: "#c2f0c2",
    api: "#ffd0d0",
    ai: "#e0d0ff",
    decision: "#ffe6cc",
    output: "#d0f0ff"
  };
  


  // State for UI controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [processingNode, setProcessingNode] = useState(null);
  const [processedNodes, setProcessedNodes] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Ready to start");
  const [elementData, setElementData] = useState({
    facility_id: "FAC-123456",
    element_name: "None",
    obligor_required: false,
    docs_found: 0
  });
  const [speed, setSpeed] = useState(1000);
  
  // Calculate positions for a hierarchical horizontal layout
  // with logical branching for decision points
  const [nodes, setNodes] = useState([
    {
      id: "1",
      type: "default",
      position: { x: 50, y: 250 },
      data: { label: "Input Facility ID" },
      style: { 
        background: nodeTypes.input, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        textAlign: "center",
        padding: "10px"
      }
    },
    {
      id: "2",
      type: "default",
      position: { x: 250, y: 250 },
      data: { label: "Read Documents from Excel" },
      style: { 
        background: nodeTypes.processing, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 450, y: 250 },
      data: { label: "Retrieve Documents from ICMP API" },
      style: { 
        background: nodeTypes.api, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 650, y: 250 },
      data: { label: "Process Each Document" },
      style: { 
        background: nodeTypes.processing, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 850, y: 250 },
      data: { label: "Identify Candidate Doc Types" },
      style: { 
        background: nodeTypes.processing, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 1050, y: 150 },
      data: { label: "Retrieve Obligor ID" },
      style: { 
        background: nodeTypes.api, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 1250, y: 250 },
      data: { label: "Determine Document Date using AI" },
      style: { 
        background: nodeTypes.ai, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 1450, y: 250 },
      data: { label: "Filter Documents by Date" },
      style: { 
        background: nodeTypes.processing, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 1650, y: 250 },
      data: { label: "Extract Relevant Fields" },
      style: { 
        background: nodeTypes.processing, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 1850, y: 250 },
      data: { label: "Prioritize Extracted Data" },
      style: { 
        background: nodeTypes.processing, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 2050, y: 250 },
      data: { label: "More Elements?" },
      style: { 
        background: nodeTypes.decision, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
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
      position: { x: 2250, y: 250 },
      data: { label: "Final Value Determined" },
      style: { 
        background: nodeTypes.output, 
        border: "1px solid #333", 
        width: 120, 
        height: 120, 
        borderRadius: "50%", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        textAlign: "center",
        padding: "10px",
        opacity: 0.5 
      }
    }
  ]);

  // Define edges with output labels for each step
  const [edges, setEdges] = useState([
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: false,
      label: "Facility ID: FAC-123456", // Output of step 1
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
      hidden: true
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      animated: false,
      label: "3 documents in Excel", // Output of step 2
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
      hidden: true
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      animated: false,
      label: "API documents retrieved", // Output of step 3
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
      hidden: true
    },
    {
      id: "e4-5",
      source: "4",
      target: "5",
      animated: false,
      label: "Element: Commitment Amount", // Output of step 4
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#999" },
      hidden: true
    },
    {
      id: "e5-6",
      source: "5",
      target: "6",
      animated: false,
      label: "Obligor ID required: Yes", // Output of step 5 (conditional branch)
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#ff9900", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#ff9900" },
      hidden: true
    },
    {
      id: "e6-7",
      source: "6",
      target: "7",
      animated: false,
      label: "Obligor ID: OB-78901", // Output of step 6
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#ff9900", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#ff9900" },
      hidden: true
    },
    {
      id: "e5-7",
      source: "5",
      target: "7",
      animated: false,
      label: "No obligor required",
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 1, strokeDasharray: "5,5" },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e7-8",
      source: "7",
      target: "8",
      animated: false,
      label: "Dates determined by AI", // Output of step 7
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e8-9",
      source: "8",
      target: "9",
      animated: false,
      label: "2 documents filtered", // Output of step 8
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e9-10",
      source: "9", 
      target: "10",
      animated: false,
      label: "Fields extracted", // Output of step 9
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e10-11",
      source: "10",
      target: "11",
      animated: false,
      label: "Commitment: $5M", // Output of step 10
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e11-4",
      source: "11",
      target: "4",
      animated: false,
      label: "Next element: Maturity Date", // Output of step 11 (loop)
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#0088cc", strokeWidth: 1, strokeDasharray: "5,5" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#0088cc" },
      hidden: true,
      type: 'smoothstep',
      pathOptions: { offset: 20 },
    },
    {
      id: "e11-12",
      source: "11",
      target: "12",
      animated: false,
      label: "All elements processed", // Final output
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: '10px' },
      labelBgStyle: { fill: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', padding: '2px' },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
  ]);

  // Process steps to control the animation with edge output labels
  const processSteps = [
    // Step 0: Start with facility ID
    {
      nodeId: "1",
      edgeId: "e1-2",
      message: "Input facility ID",
      output: "Facility ID: FAC-123456",
      action: () => {
        updateNodeStyle("1", { opacity: 1, border: "2px solid red" });
        setElementData({
          ...elementData,
          facility_id: "FAC-123456"
        });
      }
    },
    // Step 1: Read from Excel
    {
      nodeId: "2",
      edgeId: "e2-3",
      message: "Reading documents from Excel...",
      output: "3 documents in Excel",
      action: () => {
        updateNodeStyle("1", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("2", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e1-2", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
        setElementData({
          ...elementData,
          docs_found: 3
        });
      }
    },
    // Step 2: Retrieve from API
    {
      nodeId: "3",
      edgeId: "e3-4",
      message: "Retrieving documents from ICMP API...",
      output: "API documents retrieved",
      action: () => {
        updateNodeStyle("2", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("3", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e2-3", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 3: Process Each Element
    {
      nodeId: "4",
      edgeId: "e4-5",
      message: "Starting element processing loop...",
      output: "Element: Commitment Amount",
      action: () => {
        updateNodeStyle("3", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("4", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e3-4", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
        setElementData({
          ...elementData,
          element_name: "Commitment Amount"
        });
      }
    },
    // Step 4: Identify Candidate Doc Types
    {
      nodeId: "5",
      edgeId: "e5-6",
      message: "Identifying candidate document types...",
      output: "Obligor ID required: Yes",
      action: () => {
        updateNodeStyle("4", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("5", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e4-5", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 5: Conditional - Need Obligor ID?
    {
      nodeId: "6",
      edgeId: "e6-7",
      message: "Element requires obligor_id, retrieving...",
      output: "Obligor ID: OB-78901",
      action: () => {
        updateNodeStyle("5", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("6", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e5-6", { hidden: false, animated: true, stroke: "orange", strokeWidth: 2 });
        setElementData({
          ...elementData,
          obligor_required: true
        });
      }
    },
    // Step 6: Determine Document Date
    {
      nodeId: "7",
      edgeId: "e7-8",
      message: "Using AI to determine document dates...",
      output: "Dates determined by AI",
      action: () => {
        updateNodeStyle("6", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("7", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e6-7", { hidden: false, animated: true, stroke: "orange", strokeWidth: 2 });
      }
    },
    // Step 7: Filter Documents
    {
      nodeId: "8",
      edgeId: "e8-9",
      message: "Filtering documents by date...",
      output: "2 documents filtered",
      action: () => {
        updateNodeStyle("7", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("8", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e7-8", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 8: Extract Fields
    {
      nodeId: "9",
      edgeId: "e9-10",
      message: "Extracting relevant fields from documents...",
      output: "Fields extracted",
      action: () => {
        updateNodeStyle("8", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("9", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e8-9", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 9: Prioritize Data
    {
      nodeId: "10",
      edgeId: "e10-11",
      message: "Prioritizing extracted data...",
      output: "Commitment: $5M",
      action: () => {
        updateNodeStyle("9", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("10", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e9-10", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 10: Decision - More Elements?
    {
      nodeId: "11",
      edgeId: "e11-4",
      message: "Checking if more elements to process...",
      output: "Next element: Maturity Date",
      action: () => {
        updateNodeStyle("10", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("11", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e10-11", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 11: Loop back to process next element
    {
      nodeId: "4",
      edgeId: "e4-5",
      message: "Processing next element...",
      output: "Element: Maturity Date",
      action: () => {
        updateNodeStyle("11", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("4", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e11-4", { hidden: false, animated: true, stroke: "blue", strokeWidth: 2 });
        setElementData({
          ...elementData,
          element_name: "Maturity Date"
        });
        // Update the output label for the next iteration
        updateEdgeLabel("e4-5", "Element: Maturity Date");
      }
    },
    // Step 12: Complete second iteration and decide no more elements
    {
      nodeId: "11",
      edgeId: "e11-12",
      message: "No more elements to process",
      output: "All elements processed",
      action: () => {
        // We're skipping nodes 5-10 for simplicity in the second iteration
        updateNodeStyle("4", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("11", { opacity: 1, border: "2px solid red" });
        // Show completed path visually
        updateEdgeStyle("e11-12", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 13: Completed processing
    {
      nodeId: "12",
      message: "Processing complete!",
      action: () => {
        updateNodeStyle("11", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("12", { opacity: 1, border: "2px solid red" });
        setIsPlaying(false);
      }
    }
  ];

  // Helper function to update node styling
  const updateNodeStyle = (id, styleUpdates) => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === id) {
          // For circular nodes, make sure we maintain the circular styling
          return { 
            ...node, 
            style: { 
              ...node.style, 
              ...styleUpdates,
              // Always maintain these properties for circular nodes
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120
            } 
          };
        }
        return node;
      })
    );
};  // Add the closing brace for the component
// Helper function to update edge styling
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
            }
          };
        }
        return edge;
      })
    );
  };

  // Helper function to update edge labels
  const updateEdgeLabel = (id, newLabel) => {
    setEdges(prevEdges => 
      prevEdges.map(edge => {
        if (edge.id === id) {
          return { 
            ...edge, 
            label: newLabel
          };
        }
        return edge;
      })
    );
  };

  // Function to move to the next step
  const nextStep = () => {
    if (currentStep < processSteps.length) {
      const step = processSteps[currentStep];
      setProcessingNode(step.nodeId);
      setStatusMessage(step.message);
      step.action();
      
      // Update the edge label with the output if available
      if (step.edgeId && step.output) {
        updateEdgeLabel(step.edgeId, step.output);
      }
      
      setProcessedNodes(prev => [...prev, processingNode].filter(Boolean));
      setCurrentStep(prev => prev + 1);
    }
  };

  // Reset the flow
  const resetFlow = () => {
    // Reset all nodes to initial state
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
          stroke: edge.id.includes("5-6") || edge.id.includes("6-7") ? "#ff9900" : 
                  edge.id.includes("11-4") ? "#0088cc" : "#999",
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
      facility_id: "FAC-123456",
      element_name: "None",
      obligor_required: false,
      docs_found: 0
    });
    setIsPlaying(false);

    // Start from the beginning
    setTimeout(() => {
      nextStep();
    }, 500);
  };

  // Auto-play functionality
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < processSteps.length) {
      timer = setTimeout(() => {
        nextStep();
      }, speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed]);

  // Start the flow automatically on first render
  useEffect(() => {
    if (currentStep === 0) {
      nextStep();
    }
  }, []);
   // Calculate the dimensions for the container based on the horizontal layout
   const containerWidth = 2400; // Increased to accommodate horizontal layout
   const containerHeight = 700;  // Reduced height since we're using horizontal layout
 
   return (
     <div style={{ width: "100%", height: containerHeight, border: "1px solid #ddd", overflow: "auto" }}>
       <div style={{ padding: "10px", textAlign: "center", fontWeight: "bold", fontSize: "18px", borderBottom: "1px solid #ccc" }}>
         FRY14 Document Processing Flow - Horizontal Layout
       </div>
       
       <div style={{ width: containerWidth, height: containerHeight - 40 }}>
         <ReactFlow
           nodes={nodes}
           edges={edges}
           fitView
           fitViewOptions={{ padding: 0.2 }}
           defaultZoom={0.7}
           maxZoom={1.5}
           minZoom={0.3}
           nodesDraggable={false}
           nodesConnectable={false}
           elementsSelectable={false}
           preventScrolling={false}
         >
           <Background color="#f0f0f0" variant="dots" gap={12} size={1} />
           <Controls showInteractive={false} />
           
           {/* Process Controls Panel */}
           <Panel position="top-left">
             <div style={{
               background: "white",
               padding: "10px",
               borderRadius: "5px",
               border: "1px solid #ddd",
               boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
             }}>
               <div style={{ fontWeight: "bold", marginBottom: "8px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Process Controls</div>
               <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                 <button
                   onClick={() => setIsPlaying(!isPlaying)}
                   style={{
                     padding: "5px 10px",
                     backgroundColor: isPlaying ? "#f44336" : "#4CAF50",
                     color: "white",
                     border: "none",
                     borderRadius: "3px",
                     cursor: "pointer",
                     fontWeight: "bold",
                     boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                   }}
                 >
                   {isPlaying ? "⏸ Pause" : "▶ Play"}
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
                     cursor: isPlaying ? "not-allowed" : "pointer",
                     fontWeight: "bold",
                     boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                   }}
                 >
                   ⏭ Next
                 </button>
                 <button
                   onClick={resetFlow}
                   style={{
                     padding: "5px 10px",
                     backgroundColor: "#FF9800",
                     color: "white",
                     border: "none",
                     borderRadius: "3px",
                     cursor: "pointer",
                     fontWeight: "bold",
                     boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                   }}
                 >
                   🔄 Reset
                 </button>
               </div>
               <div>
                 <div style={{ marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
                   <span>Animation Speed:</span>
                   <span>{Math.round(3200 - speed)}ms</span>
                 </div>
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
           </Panel>
            {/* Legend Panel */}
            <Panel position="bottom-right">
             <div style={{ 
               background: "white", 
               padding: "10px", 
               borderRadius: "5px",
               border: "1px solid #ddd",
               fontSize: "12px",
               boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
             }}>
               <div style={{ fontWeight: "bold", marginBottom: "5px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Legend</div>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "15px", height: "15px", background: nodeTypes.input, marginRight: "5px", border: "1px solid #333", borderRadius: "3px" }}></div>
                   <span>Input</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "15px", height: "15px", background: nodeTypes.processing, marginRight: "5px", border: "1px solid #333", borderRadius: "3px" }}></div>
                   <span>Processing</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "15px", height: "15px", background: nodeTypes.api, marginRight: "5px", border: "1px solid #333", borderRadius: "3px" }}></div>
                   <span>API</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "15px", height: "15px", background: nodeTypes.ai, marginRight: "5px", border: "1px solid #333", borderRadius: "3px" }}></div>
                   <span>AI</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "15px", height: "15px", background: nodeTypes.decision, marginRight: "5px", border: "1px solid #333", borderRadius: "3px" }}></div>
                   <span>Decision</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "15px", height: "15px", background: nodeTypes.output, marginRight: "5px", border: "1px solid #333", borderRadius: "3px" }}></div>
                   <span>Output</span>
                 </div>
               </div>
               
               <div style={{ marginTop: "10px", fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Edge Types</div>
               <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "25px", height: "3px", background: "#999", marginRight: "5px" }}></div>
                   <span>Normal Flow</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "25px", height: "3px", background: "#ff9900", marginRight: "5px" }}></div>
                   <span>Conditional Path</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{ width: "25px", height: "3px", background: "#0088cc", marginRight: "5px", borderTop: "1px dashed #0088cc" }}></div>
                   <span>Loop Back</span>
                 </div>
               </div>
             </div>
           </Panel>
           
           {/* Status Panel */}
           <Panel position="top-right">
             <div style={{
               background: "white",
               padding: "10px",
               borderRadius: "5px",
               border: "1px solid #ddd",
               maxWidth: "300px",
               boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
             }}>
               <div style={{ fontWeight: "bold", marginBottom: "5px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Process Status</div>
               <div style={{ 
                 padding: "8px", 
                 backgroundColor: "#f0f8ff", 
                 borderRadius: "3px", 
                 marginBottom: "10px",
                 borderLeft: "4px solid #2196F3",
                 fontWeight: "bold"
               }}>
                 {currentStep > 0 && currentStep <= processSteps.length ? 
                   `Step ${currentStep}/${processSteps.length-1}: ${statusMessage}` : 
                   statusMessage}
               </div>
               <div style={{ fontWeight: "bold", marginBottom: "5px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Current Data</div>
               <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                 <tbody>
                   <tr>
                     <td style={{ padding: "5px", borderBottom: "1px solid #eee", backgroundColor: "#f9f9f9" }}>Facility ID:</td>
                     <td style={{ padding: "5px", borderBottom: "1px solid #eee", fontWeight: "bold", color: "#2196F3" }}>{elementData.facility_id}</td>
                   </tr>
                   <tr>
                     <td style={{ padding: "5px", borderBottom: "1px solid #eee", backgroundColor: "#f9f9f9" }}>Element:</td>
                     <td style={{ padding: "5px", borderBottom: "1px solid #eee", fontWeight: "bold", color: elementData.element_name === "None" ? "#999" : "#e91e63" }}>{elementData.element_name}</td>
                   </tr>
                   <tr>
                     <td style={{ padding: "5px", borderBottom: "1px solid #eee", backgroundColor: "#f9f9f9" }}>Obligor Required:</td>
                     <td style={{ 
                       padding: "5px", 
                       borderBottom: "1px solid #eee", 
                       fontWeight: "bold", 
                       color: elementData.obligor_required ? "#ff9800" : "#999" 
                     }}>
                       {elementData.obligor_required ? "Yes" : "No"}
                     </td>
                   </tr>
                   <tr>
                     <td style={{ padding: "5px", backgroundColor: "#f9f9f9" }}>Docs Found:</td>
                     <td style={{ 
                       padding: "5px", 
                       fontWeight: "bold",
                       color: elementData.docs_found > 0 ? "#4caf50" : "#999"
                     }}>
                       {elementData.docs_found}
                     </td>
                   </tr>
                 </tbody>
               </table>
               
               {/* Progress bar */}
               <div style={{ marginTop: "10px" }}>
                 <div style={{ fontSize: "12px", marginBottom: "3px", display: "flex", justifyContent: "space-between" }}>
                   <span>Progress: {Math.round((currentStep / (processSteps.length-1)) * 100)}%</span>
                   <span>{currentStep}/{processSteps.length-1}</span>
                 </div>
                 <div style={{ width: "100%", backgroundColor: "#e0e0e0", borderRadius: "3px", height: "8px" }}>
                   <div 
                     style={{ 
                       width: `${Math.round((currentStep / (processSteps.length-1)) * 100)}%`, 
                       backgroundColor: "#4CAF50", 
                       height: "8px",
                       borderRadius: "3px",
                       transition: "width 0.3s ease-in-out"
                     }}
                   ></div>
                 </div>
               </div>
             </div>
           </Panel>
         </ReactFlow>
       </div>
     </div>
     
   );
           
          
};

export default FacilityDocumentFlow;