import * as React from 'react';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { PixelCanvasProps, PixelGrid } from '../types';

const PixelCanvas: React.FC<PixelCanvasProps> = ({ gridSize, cellSize, currentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<PixelGrid>(() => 
    Array(gridSize).fill(null).map(() => Array(gridSize).fill(null))
  );
  const [isDrawing, setIsDrawing] = useState(false);

  // Inicializar grid al cambiar tamaño
  useEffect(() => {
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)));
  }, [gridSize]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const totalSize = gridSize * cellSize;
    ctx.clearRect(0, 0, totalSize, totalSize);

    // Dibujar pixeles
    grid.forEach((row: (string | null)[], rowIndex: number) => {
      row.forEach((color: string | null, colIndex: number) => {
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(colIndex * cellSize, rowIndex * cellSize, cellSize, cellSize);
        }
      });
    });

    // Dibujar Grilla (opcional, para guiar)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i++) {
      // Líneas verticales
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, totalSize);
      ctx.stroke();

      // Líneas horizontales
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(totalSize, i * cellSize);
      ctx.stroke();
    }
  }, [grid, gridSize, cellSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Usar requestAnimationFrame para un renderizado suave
    let animationFrameId: number;
    const render = () => {
      draw(ctx);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [draw]);

  const handlePointerAction = (e: React.MouseEvent | React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (col >= 0 && col < gridSize && row >= 0 && row < gridSize) {
      if (grid[row][col] !== currentColor) {
        const newGrid = [...grid];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = currentColor;
        setGrid(newGrid);
      }
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    handlePointerAction(e);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      handlePointerAction(e);
    }
  };

  const onMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        width={gridSize * cellSize}
        height={gridSize * cellSize}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default PixelCanvas;
