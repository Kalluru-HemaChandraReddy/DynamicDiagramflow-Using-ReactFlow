import React, { useState, useEffect, useRef } from "react";

export default function Sidebar({
  addNode,
  addEdge,
  nodes,
  edges,
  deleteNode,
  deleteEdge,
  editNodeLabel,
  exportJSON,
  importJSON
}) {
  const [label, setLabel] = useState("");
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [selectedEditId, setSelectedEditId] = useState("");
  const [editLabelValue, setEditLabelValue] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (nodes && nodes.length) {
      setSource((prev) => (nodes.find(n => n.id === prev) ? prev : nodes[0].id));
      setTarget((prev) => (nodes.find(n => n.id === prev) ? prev : nodes[0].id));
    } else {
      setSource("");
      setTarget("");
    }
  }, [nodes]);

  useEffect(() => {
    if (selectedEditId) {
      const node = nodes.find(n => n.id === selectedEditId);
      setEditLabelValue(node?.data?.label || "");
    } else {
      setEditLabelValue("");
    }
  }, [selectedEditId, nodes]);

  function handleAddNode() {
    if (!label.trim()) return alert("Enter a label for the node.");
    addNode(label.trim());
    setLabel("");
  }

  function handleAddEdge() {
    if (!source || !target) return alert("Select both source and target");
    addEdge(source, target);
  }

  function handleEditSave() {
    if (!selectedEditId) return;
    editNodeLabel(selectedEditId, editLabelValue);
    setSelectedEditId("");
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        importJSON(parsed);
      } catch (err) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  }

  return (
    <aside className="sidebar">
      <div className="panel">
        <h3>Controls</h3>

        <div className="control-block">
          <label>Node label</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Type node label" />
          <button className="primary" onClick={handleAddNode}>Add Node</button>
        </div>

        <div className="control-block">
          <h4>Connect nodes</h4>
          <label>Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.data?.label || n.id}</option>)}
          </select>
          <label>Target</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.data?.label || n.id}</option>)}
          </select>
          <button onClick={handleAddEdge}>Add Edge</button>
        </div>

        <div className="control-block">
          <h4>Nodes</h4>
          {nodes.length === 0 && <small>No nodes yet</small>}
          <ul className="list">
            {nodes.map(n => (
              <li key={n.id} className="list-item">
                <div>
                  <strong>{n.data?.label || n.id}</strong>
                  <div className="muted">id: {n.id}</div>
                </div>
                <div className="actions">
                  <button onClick={() => { setSelectedEditId(n.id); }}>Edit</button>
                  <button className="danger" onClick={() => deleteNode(n.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selectedEditId && (
          <div className="control-block">
            <h4>Edit node</h4>
            <label>Label</label>
            <input value={editLabelValue} onChange={(e) => setEditLabelValue(e.target.value)} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleEditSave} className="primary">Save</button>
              <button onClick={() => setSelectedEditId("")}>Cancel</button>
            </div>
          </div>
        )}

        <div className="control-block">
          <h4>Edges</h4>
          {edges.length === 0 && <small>No edges</small>}
          <ul className="list">
            {edges.map(e => (
              <li key={e.id} className="list-item">
                <div>
                  <div><strong>{e.id}</strong></div>
                  <div className="muted">{e.source} → {e.target}</div>
                </div>
                <div className="actions">
                  <button className="danger" onClick={() => deleteEdge(e.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="control-block">
          <h4>Save / Load</h4>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="primary" onClick={exportJSON}>Export JSON</button>
            <button onClick={() => fileRef.current?.click()}>Import JSON</button>
            <input ref={fileRef} type="file" accept="application/json" style={{ display: "none" }} onChange={onFileChange} />
          </div>
          <small className="muted">Export a snapshot you and your team can open or import to this app.</small>
        </div>

        <p className="hint">Tip: drag nodes on the canvas. Use node handles to connect. Use Delete key to remove selected items.</p>
      </div>
    </aside>
  );
}
