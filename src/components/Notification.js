
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function Notification({ message }) {
  const [open, setOpen] = useState(false);

 
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      open={open}
      autoHideDuration={2800}
      onClose={handleClose}
      message={message}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
      sx={{
        '& .MuiSnackbarContent-root':message.includes("joined") ?  {
          backgroundColor: 'green', 
          color: 'white', 
          fontWeight: 'bold',
        }: {
            backgroundColor: 'red', 
            color: 'white', 
            fontWeight: 'bold',
          },
      }}
    />
  );
}
