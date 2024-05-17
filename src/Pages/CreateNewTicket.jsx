import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc, serverTimestamp } from '../Firebase';
import { Typography, TextField, Button, Grid, Modal, Box } from '@mui/material';
import './CreateTicketForm.css';
import { set } from 'firebase/database';
import { Refresh } from '@mui/icons-material';

const CreateTicketForm = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTicket = {
      title,
      description,
      contact,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'tickets'), newTicket);
      setShowModal(true); // Show the success modal
      setTimeout(() => {
        setShowModal(false); // Hide the modal after a few seconds
        onClose(); // Close the create ticket modal
        Refresh(); // Refresh the page
      }, 3000); // Hide after 3 seconds
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
              rows={4}
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
