# Procedural Game World Generator

A self-adapting AI system for generating dynamic 2D game worlds using multi-agent structures and PyTorch's TorchScript.

## Features
- Procedurally generated game worlds with terrain agents.
- Self-adapting AI model that adjusts based on simulated player input.
- Real-time visualization with PixiJS and agent metrics with Chart.js.
- Backend powered by FastAPI and Mesa.

## Setup 
### Set up Python environment
python -m venv venv
.\venv\Scripts\activate
pip install torch mesa fastapi uvicorn numpy

### Generate TorchScript model
python model.py

### Run backend
python backend.py

### Setup and run frontend
cd frontend
npm install
npm start

## Notes
- Fixed `AttributeError` by adding `@torch.jit.export` to the `adapt` method.
- Resolved Mesa `FutureWarning` by initializing `Model` with `super().__init__()`.
- Fixed PixiJS `Cannot read properties of undefined (reading 'canvas')` and `ReactCurrentOwner` errors by using `@pixi/react@6.5.0` with `pixi.js@6.5.10` and `react@18.2.0`.
- Fixed `ERESOLVE` by replacing `@inlet/react-pixi` with `@pixi/react`.
- Fixed small tile visibility by increasing size to 32x32 pixels and adjusting positions.
- Fixed tile size inconsistency and overlapping by standardizing rendering and using a 5x2 grid.
- Fixed 8+2 tile grid to proper 5x2, then switched to random scattering across 800x600 canvas.

## Chart Explanation
- The line chart shows "Agent Adaptation Metrics" for 10 agents (tiles).
- X-axis: Agents 1 to 10.
- Y-axis: Metric values (0 to 1), currently random or AI model output (higher values favor forest texture).
- Updates every 5 seconds with new data from the backend.

## Behavior
- 10 tiles scattered randomly across 800x600 canvas, with fixed positions.
- Textures (grass/forest) update every 5 seconds based on AI model outputs (> 0.5 for forest).
- Chart shows model outputs (0 to 1) for each agent, updating every 5 seconds.