# Dynamic Diagram Flow (React + React Flow)

A beginner-friendly React application that builds dynamic interactive diagram flows from JSON metadata using React Flow.  
Features include: add / edit / delete nodes and edges, drag connections on canvas, persistent state (localStorage), export/import JSON snapshots, keyboard shortcuts, and a polished responsive UI (mobile-first).

---

## Table of Contents

- Features
- Tech stack
- Quick start (setup)
- Folder structure
- How to use (short tutorial)
- Export / Import JSON
- Keyboard shortcuts
- Deployment
- Troubleshooting
- Next steps / optional improvements

---

## Features

- Dynamic rendering of nodes & edges from `src/metadata.json` or localStorage.
- Add nodes by label (random placement), drag and reposition nodes.
- Connect nodes via canvas handles or via sidebar selects.
- Edit node labels and delete nodes/edges (deleting a node removes connected edges).
- Export current diagram to JSON file and import a JSON to load a diagram.
- Keyboard shortcuts: `Delete` / `Backspace` to remove selected nodes/edges.
- Mobile-first responsive layout with gradient background and card-like canvas.

---

## Tech stack

- React (Create React App)
- React Flow (used for rendering and interacting with the diagram)
- Plain CSS (mobile-first responsive styles)

> No other libraries are used — matches assignment constraints.

---

## Quick start

Requirements:
- Node.js 16+ and npm
- Code editor (VS Code recommended)

Steps:

1. Clone or create the project (if you used the template already, skip cloning).
2. Open a terminal in the project folder.

Install:
```bash
npm install
```
Start dev server:
```bash
npm start
```
```
```
FOLDER STRUCTURE 
```
dynamic-diagram-flow/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── Diagram.js
│   │   └── Sidebar.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── metadata.json
├── package.json
└── README.md
```
How to use

Add node: Enter a label in the sidebar and click Add Node.

Move node: Drag a node on the canvas to change position.

Connect nodes:

Using mouse: drag from the round handle on a node to another node.

Using sidebar: choose source and target and click Add Edge.

Edit node: Click Edit for a node in the sidebar, change label, click Save.

Delete: Click Delete next to a node or edge in the sidebar.

Keyboard delete: Select nodes/edges on the canvas (click them) and press Delete or Backspace.

Changes are saved automatically to localStorage.
```
This is User's Giude
