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

  // Sync parent -> local
  React.useEffect(() => {
    if (!initialNodes) return;
    setNodes((curr) => {
      const same = curr.length === initialNodes.length &&
        curr.every((n, i) => n.id === initialNodes[i].id);
      return same ? curr : initialNodes;
    });
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    if (!initialEdges) return;
    setEdges((curr) => {
      const same = curr.length === initialEdges.length &&
        curr.every((e, i) => e.id === initialEdges[i].id);
      return same ? curr : initialEdges;
    });
  }, [initialEdges, setEdges]);

  // Emit local -> parent
  React.useEffect(() => onNodesChangeExternal && onNodesChangeExternal(nodes), [nodes]);
  React.useEffect(() => onEdgesChangeExternal && onEdgesChangeExternal(edges), [edges]);

  const onConnect = React.useCallback(
    (connection) => {
      const newEdges = addEdge(connection, edges);
      setEdges(newEdges);
      if (onConnectExternal) onConnectExternal(connection);
    },
    [edges, setEdges, onConnectExternal]
  );

  const onSelectionChange = React.useCallback(
    (selection) => {
      // selection is an object: { nodes: [...], edges: [...] } (React Flow)
      if (onSelectionChangeExternal) onSelectionChangeExternal(selection);
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
