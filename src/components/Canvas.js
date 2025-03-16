import React, { useEffect, useRef, useState } from 'react';

const Canvas = ({ onDraw, width, height, drawingData, brushColor, brushSize, canvasColor }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState(null); 

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);


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
     
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
    
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    setPrevPoint({ x, y }); 
    onDraw(x, y, x, y); 
  };

  const handleMouseMove = (e) => {
    if (isDrawing) {
      const { x, y } = getCoordinates(e);
      if (prevPoint) {
        onDraw(prevPoint.x, prevPoint.y, x, y); 
      }
      setPrevPoint({ x, y }); 
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setPrevPoint(null); 
  };

  const handleTouchStart = (e) => {
    e.preventDefault(); 
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    setPrevPoint({ x, y }); 
    onDraw(x, y, x, y); 
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (isDrawing) {
      const { x, y } = getCoordinates(e);
      if (prevPoint) {
        onDraw(prevPoint.x, prevPoint.y, x, y); 
      }
      setPrevPoint({ x, y }); 
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    setPrevPoint(null); 
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '1px solid black', marginTop: '20px', touchAction: 'none' }} 
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()} 
    />
  );
};

export default Canvas;