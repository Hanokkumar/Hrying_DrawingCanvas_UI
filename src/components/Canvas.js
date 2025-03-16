import React, { useEffect, useRef, useState } from 'react';

const Canvas = ({ onDraw, width, height, drawingData, brushColor, brushSize, canvasColor }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState(null); // Track the previous point

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render all drawing data
    drawingData.forEach((draw) => {
      ctx.beginPath();
      ctx.strokeStyle = draw.color || '#000000';
      ctx.lineWidth = draw.size || 5;
      ctx.moveTo(draw.x1, draw.y1);
      ctx.lineTo(draw.x2, draw.y2);
      ctx.stroke();
    });
  }, [drawingData, canvasColor]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      // For touch events
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      // For mouse events
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    setPrevPoint({ x, y }); // Set the initial point
    onDraw(x, y, x, y); // Draw a single point initially
  };

  const handleMouseMove = (e) => {
    if (isDrawing) {
      const { x, y } = getCoordinates(e);
      if (prevPoint) {
        onDraw(prevPoint.x, prevPoint.y, x, y); // Draw a line from the previous point to the current point
      }
      setPrevPoint({ x, y }); // Update the previous point
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setPrevPoint(null); // Reset the previous point
  };

  const handleTouchStart = (e) => {
    e.preventDefault(); // Prevent default touch behavior (scrolling)
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    setPrevPoint({ x, y }); // Set the initial point
    onDraw(x, y, x, y); // Draw a single point initially
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent default touch behavior (scrolling)
    if (isDrawing) {
      const { x, y } = getCoordinates(e);
      if (prevPoint) {
        onDraw(prevPoint.x, prevPoint.y, x, y); // Draw a line from the previous point to the current point
      }
      setPrevPoint({ x, y }); // Update the previous point
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    setPrevPoint(null); // Reset the previous point
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '1px solid black', marginTop: '20px', touchAction: 'none' }} // Disable touch scrolling
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
    />
  );
};

export default Canvas;