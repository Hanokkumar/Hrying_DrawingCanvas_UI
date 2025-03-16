
import React, { useState, useEffect, useRef } from 'react';
import { Container, Box, Typography, Button, Slider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { SketchPicker } from 'react-color';
import JoiningScreen from './components/JoiningScreen';
import Notification from './components/Notification';
import Canvas from './components/Canvas';
import UserList from './components/UserList';
import './components/style.css';

const App = () => {
  // const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState('');
  const [drawingData, setDrawingData] = useState([]);
  const [brushColor, setBrushColor] = useState('#000000');
  const [canvasColor, setCanvasColor] = useState('#F0F0F0');
  const [brushSize, setBrushSize] = useState(2);
  const [showBrushColorPicker, setShowBrushColorPicker] = useState(false);
  const [showCanvasColorPicker, setShowCanvasColorPicker] = useState(false);
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (joined) {
        e.preventDefault();
        e.returnValue = '';
        setShowRefreshDialog(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [joined]);

  const handleJoin = (userName) => {
    // setName(userName);
    setJoined(true);


    wsRef.current = new WebSocket('ws://103.195.246.19/api_test');

    wsRef.current.onopen = () => {
      console.log('WebSocket connection established');
      wsRef.current.send(
        JSON.stringify({
          type: 'join',
          name: userName,
        })
      );
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'draw') {
        setDrawingData((prev) => [...prev, data]);
      } else if (data.type === 'userList') {
        setUsers(data.users);
      } else if (data.type === 'notification') {
        setNotification(data.message);
        setTimeout(() => setNotification(''), 3000);
      } else if (data.type === 'clear') {
        setDrawingData([]);
      } else if (data.type === 'initialData') {
       
        setDrawingData(data.data);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  const handleDraw = (x1, y1, x2, y2) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'draw',
          x1,
          y1,
          x2,
          y2,
          color: brushColor,
          size: brushSize,
        })
      );
    }
  };

  const handleClearCanvas = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'clear' }));
    }
  };

  const handleLeave = () => {
    setShowLeaveDialog(true);
  };

  const handleLeaveConfirm = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'leave' }));
      wsRef.current.close();
    }
    setJoined(false);
    // setName('');
    setUsers([]);
    setDrawingData([]);
    setShowLeaveDialog(false);
  };

  const handleLeaveCancel = () => {
    setShowLeaveDialog(false);
  };

  const handleRefreshConfirm = () => {
    setShowRefreshDialog(false);
    window.location.reload();
  };

  const handleRefreshCancel = () => {
    setShowRefreshDialog(false);
  };

  return (
    <Container className="app-container">
      <Box className="header">
        <Typography variant="h3" className="title">
          Welcome to DrawCanvas
        </Typography>
        <Typography variant="h6" className="subtitle">by Hyring.com</Typography>
     
        <Notification message={notification} />
      </Box>

      {!joined ? (
        <JoiningScreen onJoin={handleJoin} />
      ) : (
        <Box className="main-container">

       <Box className="sidebar" sx={{ mr: 2 }}>
       <Typography  > User : {sessionStorage.getItem('UserName')}</Typography>
            <Typography variant="h6" style={{marginTop:20}}>Connected Users</Typography>
            <UserList users={users} />

            <Typography variant="h6" style={{marginTop:20}}>Tool Bar</Typography>
            <Button className="toolbar-button" style={{marginTop:20}} onClick={() => setShowBrushColorPicker(!showBrushColorPicker)}>
              Brush Color
            </Button>
            {showBrushColorPicker && (
              <SketchPicker color={brushColor} onChangeComplete={(color) => setBrushColor(color.hex)} />
            )}

            <Button className="toolbar-button"  style={{marginTop:20}} onClick={() => setShowCanvasColorPicker(!showCanvasColorPicker)}>
              Canvas Color
            </Button>
            {showCanvasColorPicker && (
              <SketchPicker color={canvasColor} onChangeComplete={(color) => setCanvasColor(color.hex)} />
            )}

           
            <Typography variant="body2"  style={{marginTop:20}} >Brush Size</Typography>
            <Slider value={brushSize} min={1} max={20} onChange={(e, value) => setBrushSize(value)} />
          </Box>

         
          <Box className="canvas-container">
            <Canvas
              onDraw={handleDraw}
              width={800}
              height={600}
              drawingData={drawingData}
              brushColor={brushColor}
              brushSize={brushSize}
              canvasColor={canvasColor}
            />
          </Box>

      
          <Box className="action-buttons">
            <Button className="clear-button"  style={{marginLeft:20}} onClick={handleClearCanvas}>
              Clear
            </Button>
            <Button className="leave-button"  onClick={handleLeave}>
              Leave Room
            </Button>
          </Box>
        </Box>
      )}

     
      <Dialog open={showLeaveDialog} onClose={handleLeaveCancel}>
        <DialogTitle>Leave Room</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to leave the room?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLeaveCancel}>Cancel</Button>
          <Button onClick={handleLeaveConfirm} color="primary">
            Leave
          </Button>
        </DialogActions>
      </Dialog>

  
      <Dialog open={showRefreshDialog} onClose={handleRefreshCancel}>
        <DialogTitle>Are you sure you want to refresh?</DialogTitle>
        <DialogContent>
          <Typography>You will be disconnected from the room.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRefreshCancel}>Cancel</Button>
          <Button onClick={handleRefreshConfirm} color="primary">
            Refresh
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;