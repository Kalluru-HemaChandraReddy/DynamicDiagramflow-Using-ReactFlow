// src/components/Diagram.js
import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function Diagram({
  initialNodes,
  initialEdges,
  onNodesChangeExternal,
  onEdgesChangeExternal,
  onSelectionChangeExternal,
  onConnectExternal,
  fitView
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);

  /**
   * Keep local state in sync with parent-provided initialNodes/initialEdges.
   * We include setNodes/setEdges in deps (they are stable from hook),
   * and initialNodes/initialEdges so effect runs when parent updates them.
   */
  React.useEffect(() => {
    if (!initialNodes) return;
    setNodes((curr) => {
      const same =
        curr.length === initialNodes.length &&
        curr.every((n, i) => n.id === initialNodes[i].id);
      return same ? curr : initialNodes;
    });
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    if (!initialEdges) return;
    setEdges((curr) => {
      const same =
        curr.length === initialEdges.length &&
        curr.every((e, i) => e.id === initialEdges[i].id);
      return same ? curr : initialEdges;
    });
  }, [initialEdges, setEdges]);

  // Emit local -> parent when local nodes/edges change
  React.useEffect(() => {
    if (typeof onNodesChangeExternal === "function") {
      onNodesChangeExternal(nodes);
    }
  }, [nodes, onNodesChangeExternal]);

  React.useEffect(() => {
    if (typeof onEdgesChangeExternal === "function") {
      onEdgesChangeExternal(edges);
    }
  }, [edges, onEdgesChangeExternal]);

  // Called when a connection is made via drag handles
  const onConnect = React.useCallback(
    (connection) => {
      const newEdges = addEdge(connection, edges);
      setEdges(newEdges);
      if (typeof onConnectExternal === "function") onConnectExternal(connection);
    },
    [edges, setEdges, onConnectExternal]
  );

  // Selection change handler (selected nodes/edges)
  const onSelectionChange = React.useCallback(
    (selection) => {
      // selection is an object { nodes: [...], edges: [...] }
      if (typeof onSelectionChangeExternal === "function") {
        onSelectionChangeExternal(selection);
      }
    },
    [onSelectionChangeExternal]
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView={fitView}
      >
        <Background gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
