import React, { useState, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [worldData, setWorldData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    console.log('React version:', React.version);
    const app = new PIXI.Application({ 
      width: 800, 
      height: 600, 
      backgroundColor: 0x000000,
      antialias: true,
      autoStart: true
    });

    const canvasContainer = document.getElementById('game-canvas');
    if (canvasContainer && app.view instanceof HTMLCanvasElement) {
      canvasContainer.appendChild(app.view);
    } else {
      console.error('Canvas container not found or app.view is not a canvas element');
      return;
    }

    const renderTiles = (tiles) => {
      app.stage.removeChildren();
      tiles.forEach(tile => {
        const sprite = new PIXI.Sprite(
          PIXI.Texture.from(tile.texture === 'forest' ? '/forest.png' : '/grass.png')
        );
        sprite.x = tile.x * 32; // 5x2 grid scaled to canvas
        sprite.y = tile.y * 32;
        sprite.width = 32;
        sprite.height = 32;
        app.stage.addChild(sprite);
        console.log('Rendered tile:', tile); // Debug
      });
    };

    fetch('http://localhost:8000/generate_world')
      .then(response => response.json())
      .then(data => {
        console.log('World data:', data);
        setWorldData(data.terrain);
        setLoading(false);
        renderTiles(data.terrain);
        setMetrics(data.terrain.map(tile => tile.output || 0));
      })
      .catch(error => console.error('Error fetching world data:', error));

    const interval = setInterval(() => {
      fetch('http://localhost:8000/update_world')
        .then(response => response.json())
        .then(data => {
          console.log('Updated world data:', data);
          setWorldData(data.terrain);
          renderTiles(data.terrain);
          setMetrics(data.terrain.map(tile => tile.output || 0));
        })
        .catch(error => console.error('Error updating world:', error));
    }, 5000);

    return () => {
      clearInterval(interval);
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, []);

  const chartData = {
    labels: worldData.map((_, i) => `Agent ${i + 1}`),
    datasets: [
      {
        label: 'Agent Adaptation Metrics',
        data: metrics,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Procedural Game World Generator</h1>
      {loading ? <p>Loading world...</p> : <p>World with {worldData.length} tiles</p>}
      <div id="game-canvas" className="mb-4"></div>
      <div className="w-full max-w-2xl">
        <Line data={chartData} options={{ responsive: true, plugins: { title: { display: true, text: 'Agent Adaptation Metrics' } } }} />
      </div>
    </div>
  );
};

export default App;