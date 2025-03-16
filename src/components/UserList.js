import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const UserList = ({ users }) => {
  return (
    <Box mt={2}>
      <Typography variant="h6"></Typography>
      <Paper elevation={3} style={{ maxHeight: '150px', overflow: 'auto' }}>
        <List>
          {users.map((user, index) => (
            <ListItem key={index}>
              <ListItemText primary={user} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default UserList;