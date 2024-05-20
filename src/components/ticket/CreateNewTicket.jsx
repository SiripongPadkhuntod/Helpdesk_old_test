import React, { useState } from 'react';
import { Typography, TextField, Button, Grid, Modal, Box } from '@mui/material';
import './CreateTicketForm.css';

const CreateTicketForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTicket = {
      title,
      description,
      contact,
      status: 'pending',
      createdAt: new Date().toISOString(),  // Use ISO string format for timestamps
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://localhost:7001/addTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      });
      
      if (response.ok) {
        setShowModal(true); // Show the success modal
        setTimeout(() => {
          setShowModal(false); // Hide the modal after a few seconds
          onClose(); // Close the form
          window.location.reload(); // Refresh the page
        }, 1000); // Hide after 1 second
      } else {
        console.error("Error adding ticket: ", response.statusText);
      }
    } catch (error) {
      console.error("Error adding ticket: ", error);
    }
  };

  return (
    <div className="create-ticket-form">
      <Typography variant="h5" gutterBottom>Create New Ticket</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Information"
              variant="outlined"
              fullWidth
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>Create Ticket</Button>
      </form>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, textAlign: 'center', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Typography variant="h6" gutterBottom>Success!</Typography>
          <Typography variant="body1">Ticket has been successfully created.</Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateTicketForm;
