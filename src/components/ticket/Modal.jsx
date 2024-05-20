import React from 'react';
import { Modal, Paper, Typography, Button, TextField, Grid } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const TicketViewModal = ({ open, onClose, ticket }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="ticket-modal-title"
    aria-describedby="ticket-modal-description"
  >
    <Paper sx={modalStyle}>
      {ticket && (
        <>
          <Typography id="ticket-modal-title" variant="h6" component="h2">
            {ticket.title}
          </Typography>
          <Typography variant="body1" gutterBottom><strong>Description:</strong> {ticket.description}</Typography>
          <Typography variant="body1" gutterBottom><strong>Status:</strong> {ticket.status}</Typography>
          <Typography variant="body1" gutterBottom><strong>Contact:</strong> {ticket.contact}</Typography>
          <Typography variant="body1" gutterBottom><strong>Created At:</strong> {formatTimestamp(ticket.createdAt)}</Typography>
          <Typography variant="body1" gutterBottom><strong>Updated At:</strong> {formatTimestamp(ticket.updatedAt)}</Typography>
          <Grid container spacing={1} justifyContent='flex-end'>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
                sx={{ mt: 2, ml: 2 }}
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  </Modal>
);

export const TicketEditModal = ({ open, onClose, ticket, onChange, onSave, isModified }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="edit-ticket-modal-title"
    aria-describedby="edit-ticket-modal-description"
  >
    <Paper sx={modalStyle}>
      {ticket && (
        <>
          <Typography id="edit-ticket-modal-title" variant="h6" component="h2">
            Edit Ticket
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            value={ticket.title}
            onChange={(e) => onChange({ ...ticket, title: e.target.value })}
          />
          <TextField
            multiline
            minRows={3}
            maxRows={15}
            fullWidth
            margin="normal"
            label="Description"
            value={ticket.description}
            onChange={(e) => onChange({ ...ticket, description: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Contact"
            value={ticket.contact}
            onChange={(e) => onChange({ ...ticket, contact: e.target.value })}
          />
          <Typography variant="body1" gutterBottom><strong>Created At:</strong> {formatTimestamp(ticket.createdAt)}</Typography>
          <Typography variant="body1" gutterBottom><strong>Updated At:</strong> {formatTimestamp(ticket.updatedAt)}</Typography>
          <Grid container spacing={1} justifyContent='flex-end'>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={onSave}
                disabled={!isModified()}
                sx={{ mt: 2 }}
              >
                Save
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
                sx={{ mt: 2, ml: 2 }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  </Modal>
);

const formatTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
};
