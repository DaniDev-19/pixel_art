import * as React from 'react';
import { useState } from 'react';
import PixelCanvas from "./components/PixelCanvas";
import type { ColorCode } from './types';
import "./index.css";

const PixelApp: React.FC = () => {
  const [color, setColor] = useState<ColorCode>("#ffffff");
  const [gridSize, setGridSize] = useState(32);
  const cellSize = 15;

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "pixel-art.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="pixel-app-container">
      <h1>Pixel Art Studio</h1>

      <div className="controls">
        <div className="control-group">
          <label>Color: </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
          />
        </div>

        <div className="control-group">
          <label>
            Grid: {gridSize}x{gridSize}
          </label>
        </div>

        <button onClick={() => setGridSize((prev) => (prev === 32 ? 16 : 32))}>
          Cambiar Tamaño
        </button>

        <button className="secondary" onClick={handleDownload}>
          Exportar PNG
        </button>
      </div>

      <PixelCanvas
        gridSize={gridSize}
        cellSize={cellSize}
        currentColor={color}
      />

      <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>
        Click para pintar | Mantén click y arrastra para dibujar continuo
      </p>
    </div>
  );
};

export default PixelApp;
