import React, { useEffect, useState, useCallback } from "react";
import Diagram from "./components/Diagram";
import Sidebar from "./components/Sidebar";
import metadata from "./metadata.json";
import "./App.css";

function readPersisted() {
  try {
    const raw = localStorage.getItem("myFlowState");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to read persisted flow", e);
    return null;
  }
}

function persistState(nodes, edges) {
  try {
    localStorage.setItem("myFlowState", JSON.stringify({ nodes, edges }));
  } catch (e) {
    console.warn("Failed to persist flow", e);
  }
}

function App() {
  const persisted = readPersisted();
  const [nodes, setNodes] = useState(persisted?.nodes || metadata.nodes || []);
  const [edges, setEdges] = useState(persisted?.edges || metadata.edges || []);
  const [selection, setSelection] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    persistState(nodes, edges);
  }, [nodes, edges]);

  // Diagram -> App sync handlers
  const handleNodesChangeExternal = (newNodes) => setNodes(newNodes);
  const handleEdgesChangeExternal = (newEdges) => setEdges(newEdges);

  // selection from diagram
  const handleSelectionChange = (sel) => {
    // sel is { nodes: [...], edges: [...] }
    setSelection({
      nodes: (sel?.nodes || []).map(n => n.id || n),
      edges: (sel?.edges || []).map(e => e.id || e)
    });
  };

  // Add node (used by sidebar)
  const addNode = (label = "New Node") => {
    const id = Date.now().toString();
    const newNode = {
      id,
      type: "default",
      position: { x: 50 + Math.floor(Math.random() * 200), y: 50 + Math.floor(Math.random() * 200) },
      data: { label }
    };
    setNodes((prev) => [...prev, newNode]);
  };

  // Delete node and any connected edges
  const deleteNode = (nodeId) => {
    setNodes((prev) => prev.filter(n => n.id !== nodeId));
    setEdges((prev) => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    // clear selection if it was selected
    setSelection((s) => ({ ...s, nodes: s.nodes.filter(id => id !== nodeId) }));
  };

  // Edit node label
  const editNodeLabel = (nodeId, newLabel) => {
    setNodes((prev) => prev.map(n => n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n));
  };

  // Add edge
  const addEdge = (source, target) => {
    if (source === target) return alert("Source and target cannot be the same");
    const id = `e${Date.now()}`;
    setEdges((prev) => [...prev, { id, source, target, type: "smoothstep" }]);
  };

  // Delete edge
  const deleteEdge = (edgeId) => {
    setEdges((prev) => prev.filter(e => e.id !== edgeId));
    setSelection((s) => ({ ...s, edges: s.edges.filter(id => id !== edgeId) }));
  };

  // Export JSON
  const exportJSON = useCallback(() => {
    const payload = { nodes, edges };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagram-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Import JSON (payload should be { nodes: [], edges: [] })
  const importJSON = (payload) => {
    if (!payload || !Array.isArray(payload.nodes) || !Array.isArray(payload.edges)) {
      return alert("Imported JSON must have `nodes` and `edges` arrays.");
    }
    setNodes(payload.nodes);
    setEdges(payload.edges);
    alert("Imported JSON loaded.");
  };

  // Keyboard shortcuts: Delete key removes selected nodes AND selected edges
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // delete selected nodes first
        if (selection.nodes && selection.nodes.length) {
          selection.nodes.forEach(id => deleteNode(id));
        }
        if (selection.edges && selection.edges.length) {
          selection.edges.forEach(id => deleteEdge(id));
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selection, nodes, edges]);

  const layout = {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    height: "100vh",
    gap: 0
  };

  // Pass down handlers
  return (
    <div style={layout}>
      <div style={{ width: "100%", height: "100%" }} className="canvas-wrap">
        <Diagram
          initialNodes={nodes}
          initialEdges={edges}
          onNodesChangeExternal={handleNodesChangeExternal}
          onEdgesChangeExternal={handleEdgesChangeExternal}
          onSelectionChangeExternal={handleSelectionChange}
          fitView={true}
        />
      </div>

      <Sidebar
        addNode={addNode}
        addEdge={addEdge}
        nodes={nodes}
        edges={edges}
        deleteNode={deleteNode}
        deleteEdge={deleteEdge}
        editNodeLabel={editNodeLabel}
        exportJSON={exportJSON}
        importJSON={importJSON}
      />
    </div>
  );
}

export default App;
