import React, { useState, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  MarkerType,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";

// This implements a significantly simpler flow with fixed positioning
// and more direct node/edge connections to ensure proper rendering

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

  // Use a completely fixed layout approach - preplanning all positions
  // to ensure nodes and edges align properly
  const [nodes, setNodes] = useState([
    {
      id: "1",
      type: "default",
      position: { x: 400, y: 50 },
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
      position: { x: 400, y: 250 },
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
      position: { x: 400, y: 450 },
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
      position: { x: 400, y: 650 },
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
      position: { x: 400, y: 850 },
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
      position: { x: 650, y: 850 },
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
      position: { x: 400, y: 1050 },
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
      position: { x: 400, y: 1250 },
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
      position: { x: 400, y: 1450 },
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
      position: { x: 400, y: 1650 },
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
      position: { x: 650, y: 1650 },
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
      position: { x: 400, y: 1850 },
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

  // Define all edges with strong visibility and labels for all
  const [edges, setEdges] = useState([
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: false,
      label: "Start Processing",
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
      label: "Current Element",
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
      label: "If obligor_id required",
      labelStyle: { fill: '#e67e00', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#ff9900", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: "#ff9900" },
      hidden: true
    },
    {
      id: "e5-7",
      source: "5",
      target: "7",
      animated: false,
      label: "No obligor needed",
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e6-7",
      source: "6",
      target: "7",
      animated: false,
      label: "With obligor ID",
      labelStyle: { fill: '#e67e00', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#ff9900", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#ff9900" },
      hidden: true
    },
    {
      id: "e7-8",
      source: "7",
      target: "8",
      animated: false,
      label: "Dated documents",
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e8-9",
      source: "8",
      target: "9",
      animated: false,
      label: "Filtered documents",
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e9-10",
      source: "9", 
      target: "10",
      animated: false,
      label: "Raw field data", 
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e10-11",
      source: "10",
      target: "11",
      animated: false,
      label: "Element value",
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
    {
      id: "e11-4",
      source: "11",
      target: "4",
      animated: false,
      label: "Yes - More Elements",
      labelStyle: { fill: '#0077b3', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#0088cc", strokeWidth: 1, strokeDasharray: "5,5" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#0088cc" },
      hidden: true
    },
    {
      id: "e11-12",
      source: "11",
      target: "12",
      animated: false,
      label: "No - Complete",
      labelStyle: { fill: '#333', fontWeight: 'bold', fontSize: 12 },
      style: { stroke: "#999", strokeWidth: 1 },
      markerEnd: { type: MarkerType.ArrowClosed },
      hidden: true
    },
  ]);

  // Process steps to control the animation
  const processSteps = [
    // Step 0: Start with facility ID
    {
      nodeId: "1",
      message: "Input facility ID",
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
      message: "Reading documents from Excel...",
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
      message: "Retrieving documents from ICMP API...",
      action: () => {
        updateNodeStyle("2", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("3", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e2-3", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 3: Process Each Element
    {
      nodeId: "4",
      message: "Starting element processing loop...",
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
      message: "Identifying candidate document types...",
      action: () => {
        updateNodeStyle("4", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("5", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e4-5", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 5: Conditional - Need Obligor ID?
    {
      nodeId: "6",
      message: "Element requires obligor_id, retrieving...",
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
      message: "Using AI to determine document dates...",
      action: () => {
        updateNodeStyle("6", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("7", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e6-7", { hidden: false, animated: true, stroke: "orange", strokeWidth: 2 });
      }
    },
    // Step 7: Filter Documents
    {
      nodeId: "8",
      message: "Filtering documents by date...",
      action: () => {
        updateNodeStyle("7", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("8", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e7-8", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 8: Extract Fields
    {
      nodeId: "9",
      message: "Extracting relevant fields from documents...",
      action: () => {
        updateNodeStyle("8", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("9", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e8-9", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 9: Prioritize Data
    {
      nodeId: "10",
      message: "Prioritizing extracted data...",
      action: () => {
        updateNodeStyle("9", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("10", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e9-10", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 10: Decision - More Elements?
    {
      nodeId: "11",
      message: "Checking if more elements to process...",
      action: () => {
        updateNodeStyle("10", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("11", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e10-11", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
      }
    },
    // Step 11: Loop back to process next element
    {
      nodeId: "4",
      message: "Processing next element...",
      action: () => {
        updateNodeStyle("11", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("4", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e11-4", { hidden: false, animated: true, stroke: "blue", strokeWidth: 2 });
        setElementData({
          ...elementData,
          element_name: "Maturity Date"
        });
      }
    },
    // Step 12: Completed processing
    {
      nodeId: "12",
      message: "Processing complete!",
      action: () => {
        updateNodeStyle("11", { opacity: 0.8, border: "2px solid green" });
        updateNodeStyle("12", { opacity: 1, border: "2px solid red" });
        updateEdgeStyle("e11-12", { hidden: false, animated: true, stroke: "red", strokeWidth: 2 });
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
  };

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

  // Function to move to the next step
  const nextStep = () => {
    if (currentStep < processSteps.length) {
      const step = processSteps[currentStep];
      setProcessingNode(step.nodeId);
      setStatusMessage(step.message);
      step.action();
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

  return (
    <div style={{ width: "100%", height: "2000px", border: "1px solid #ddd" }}>
      <div style={{ padding: "10px", textAlign: "center", fontWeight: "bold", fontSize: "18px", borderBottom: "1px solid #ccc" }}>
        FRY14 Document Processing Flow
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultZoom={0.8}
        maxZoom={1.5}
        minZoom={0.4}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        preventScrolling={false}
      >
        <Background color="#f0f0f0" variant="dots" />
        <Controls showInteractive={false} />
        
        {/* Process Controls Panel */}
        <Panel position="top-left">
          <div style={{
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd"
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
        </Panel>
        
        {/* Status Panel */}
        <Panel position="top-right">
          <div style={{
            background: "white",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            maxWidth: "250px"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Process Status</div>
            <div style={{ 
              padding: "8px", 
              backgroundColor: "#f0f8ff", 
              borderRadius: "3px", 
              marginBottom: "10px",
              borderLeft: "4px solid #2196F3"
            }}>
              {statusMessage}
            </div>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Current Data</div>
            <table style={{ width: "100%", fontSize: "12px", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>Facility ID:</td>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{elementData.facility_id}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>Element:</td>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{elementData.element_name}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee" }}>Obligor Required:</td>
                  <td style={{ padding: "3px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{elementData.obligor_required ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px" }}>Docs Found:</td>
                  <td style={{ padding: "3px", fontWeight: "bold" }}>{elementData.docs_found}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
        
        {/* Legend */}
        <Panel position="bottom-right">
          <div style={{ 
            background: "white", 
            padding: "10px", 
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "12px"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Legend</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "15px", height: "15px", background: nodeTypes.input, marginRight: "5px", border: "1px solid #333" }}></div>
                <span>Input</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "15px", height: "15px", background: nodeTypes.processing, marginRight: "5px", border: "1px solid #333" }}></div>
                <span>Processing</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "15px", height: "15px", background: nodeTypes.api, marginRight: "5px", border: "1px solid #333" }}></div>
                <span>API</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "15px", height: "15px", background: nodeTypes.ai, marginRight: "5px", border: "1px solid #333" }}></div>
                <span>AI</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "15px", height: "15px", background: nodeTypes.decision, marginRight: "5px", border: "1px solid #333" }}></div>
                <span>Decision</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "15px", height: "15px", background: nodeTypes.output, marginRight: "5px", border: "1px solid #333" }}></div>
                <span>Output</span>
              </div>
            </div>
            
            {/* Edge legend */}
            <div style={{ fontWeight: "bold", marginTop: "10px", marginBottom: "5px" }}>Edge Types</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "25px", height: "2px", background: "#999", marginRight: "5px" }}></div>
                <span>Standard Flow</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "25px", height: "2px", background: "#ff9900", marginRight: "5px" }}></div>
                <span>Conditional Path</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: "25px", height: "2px", background: "#0088cc", marginRight: "5px", borderStyle: "dashed" }}></div>
                <span>Loop Back</span>
              </div>
            </div>
          </div>
        </Panel>
        
        {/* Edge Labels Info Panel */}
        <Panel position="bottom-left">
          <div style={{ 
            background: "white", 
            padding: "10px", 
            borderRadius: "5px",
            border: "1px solid #ddd",
            fontSize: "12px",
            maxWidth: "300px"
          }}>
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Edge Labels</div>
            <div style={{ marginBottom: "8px" }}>
              The labels on each connection indicate what data is being passed between steps
              in the process flow. Labels are color-coded to match the edge type.
            </div>
            <div style={{ fontStyle: "italic", fontSize: "11px" }}>
              Note: Edge labels will appear when the animation runs.
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default FacilityDocumentFlow;