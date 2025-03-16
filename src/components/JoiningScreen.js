import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const JoiningScreen = ({ onJoin }) => {
  const [name, setName] = useState('');

  const handleJoin = () => {
    if (name.trim()) {
      onJoin(name);
      sessionStorage.setItem("UserName",name)
    }

  };

  return (
    <Box
      textAlign="center"
      mt={4}
      sx={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        padding: '0 16px', 
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.8rem', sm: '2rem' } }}>
        Login into Drawing App
      </Typography>
      <TextField
        label="Enter your name"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth 
        sx={{ marginBottom: '16px' }} 
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleJoin}
        fullWidth 
        sx={{ padding: '12px' }} 
      >
        Join
      </Button>
    </Box>
  );
};

export default JoiningScreen;