import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from '../../Firebase';
import { Container, Typography, Select, MenuItem, Button, Grid, Box, Modal, TextField, Paper, IconButton, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle , InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from "@mui/icons-material/Search"; 

const ManageTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('updatedAt');
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [originalTicket, setOriginalTicket] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'tickets'), orderBy(sort, 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketsData);
    });
    return unsubscribe;
  }, [sort]);

  const filteredTickets = tickets.filter(ticket => {
    return (filter === 'all' || ticket.status === filter) &&
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleUpdateStatus = (status) => {
    if (currentTicket) {
      updateTicketStatus(currentTicket.id, status);
      setIsConfirmDialogOpen(false);
    }
  };

  const updateTicketStatus = async (id, status) => {
    try {
      const ticketRef = doc(db, 'tickets', id);
      await updateDoc(ticketRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating ticket: ", error);
    }
  };

  const updateTicketDetails = async (id, details) => {
    try {
      const ticketRef = doc(db, 'tickets', id);
      await updateDoc(ticketRef, {
        ...details,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating ticket: ", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const getStatusButtonStyle = (status) => {
    switch (status) {
      case 'pending':
        return { backgroundColor: '#fbc02d', color: '#000' };
      case 'accepted':
        return { backgroundColor: '#4caf50', color: '#fff' };
      case 'resolved':
        return { backgroundColor: '#2196f3', color: '#fff' };
      case 'rejected':
        return { backgroundColor: '#f44336', color: '#fff' };
      default:
        return { backgroundColor: '#9e9e9e', color: '#000' };
    }
  };

  const handleViewClick = (ticket) => {
    setCurrentTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (ticket) => {
    setCurrentTicket(ticket);
    setOriginalTicket(ticket); // Store the original ticket to compare later
    setIsEditModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentTicket(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentTicket(null);
    setOriginalTicket(null);
  };

  const handleSaveEdit = () => {
    if (currentTicket) {
      updateTicketDetails(currentTicket.id, {
        title: currentTicket.title,
        description: currentTicket.description,
        contact: currentTicket.contact
      });
      handleCloseEditModal();
    }
  };

  const isModified = () => {
    if (!currentTicket || !originalTicket) return false;
    return (
      currentTicket.title !== originalTicket.title ||
      currentTicket.description !== originalTicket.description ||
      currentTicket.contact !== originalTicket.contact
    );
  };

  const openConfirmDialog = (ticket, status) => {
    setCurrentTicket(ticket);
    setStatusToUpdate(status);
    setIsConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setCurrentTicket(null);
    setStatusToUpdate(null);
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item xs={12} sm={6}>
          <Typography variant="h2" gutterBottom>Manage Tickets</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
      <TextField
        label="Search Tickets"
        variant="standard"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center" >
        <Grid item xs={12} sm={6}>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} fullWidth>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} fullWidth>
            <MenuItem value="createdAt">Created Time</MenuItem>
            <MenuItem value="updatedAt">Latest Update</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Divider sx={{ margin: '16px' }} />

      <Grid container spacing={2}>
        {filteredTickets.map(ticket => (
          <Grid item xs={6} key={ticket.id}>
            <Box className="ticket" onClick={() => handleViewClick(ticket)} sx={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px', position: 'relative', height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" noWrap>{ticket.title}</Typography>
                <Typography variant="body1" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {ticket.description}
                </Typography>
                <Typography variant="body1" noWrap><strong>Status:</strong> {ticket.status}</Typography>
                <Typography variant="body1" noWrap><strong>Contact:</strong> {ticket.contact}</Typography>
                <Typography variant="body1" noWrap><strong>Created At:</strong> {formatTimestamp(ticket.createdAt)}</Typography>
                <Typography variant="body1" noWrap><strong>Updated At:</strong> {formatTimestamp(ticket.updatedAt)}</Typography>
              </Box>
              <Box sx={{ paddingTop: 1 }} />
              <Grid container justifyContent='flex-end' >
                <Button onClick={(e) => { e.stopPropagation(); openConfirmDialog(ticket, 'pending') }} variant="outlined" sx={{ ...(ticket.status === 'pending' && getStatusButtonStyle('pending')), marginRight: '8px' }}>Pending</Button>
                <Button onClick={(e) => { e.stopPropagation(); openConfirmDialog(ticket, 'accepted') }} variant="outlined" sx={{ ...(ticket.status === 'accepted' && getStatusButtonStyle('accepted')), marginRight: '8px' }}>Accepted</Button>
                <Button onClick={(e) => { e.stopPropagation(); openConfirmDialog(ticket, 'resolved') }} variant="outlined" sx={{ ...(ticket.status === 'resolved' && getStatusButtonStyle('resolved')), marginRight: '8px' }}>Resolved</Button>
                <Button onClick={(e) => { e.stopPropagation(); openConfirmDialog(ticket, 'rejected') }} variant="outlined" sx={{ ...(ticket.status === 'rejected' && getStatusButtonStyle('rejected')), marginRight: '8px' }}>Rejected</Button>
              </Grid>
              <IconButton onClick={(e) => { e.stopPropagation(); handleEditClick(ticket); }} sx={{ position: 'absolute', top: '16px', right: '16px' }}>
                <EditIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        aria-labelledby="ticket-modal-title"
        aria-describedby="ticket-modal-description"
      >
        <Paper sx={{ ...modalStyle }}>
          {currentTicket && (
            <>
              <Typography id="ticket-modal-title" variant="h6" component="h2">
                {currentTicket.title}
              </Typography>
              <Typography variant="body1" gutterBottom><strong>Description:</strong> {currentTicket.description}</Typography>
              <Typography variant="body1" gutterBottom><strong>Status:</strong> {currentTicket.status}</Typography>
              <Typography variant="body1" gutterBottom><strong>Contact:</strong> {currentTicket.contact}</Typography>
              <Typography variant="body1" gutterBottom><strong>Created At:</strong> {formatTimestamp(currentTicket.createdAt)}</Typography>
              <Typography variant="body1" gutterBottom><strong>Updated At:</strong> {formatTimestamp(currentTicket.updatedAt)}</Typography>
              <Grid container spacing={1} justifyContent='flex-end'>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCloseViewModal}
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

      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        aria-labelledby="edit-ticket-modal-title"
        aria-describedby="edit-ticket-modal-description"
      >
        <Paper sx={{ ...modalStyle }}>
          {currentTicket && (
            <>
              <Typography id="edit-ticket-modal-title" variant="h6" component="h2">
                Edit Ticket
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Title"
                value={currentTicket.title}
                onChange={(e) => setCurrentTicket({ ...currentTicket, title: e.target.value })}
              />
              <TextField
                multiline
                minRows={3}
                maxRows={15}
                fullWidth
                margin="normal"
                label="Description"
                value={currentTicket.description}
                onChange={(e) => setCurrentTicket({ ...currentTicket, description: e.target.value })}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Contact"
                value={currentTicket.contact}
                onChange={(e) => setCurrentTicket({ ...currentTicket, contact: e.target.value })}
              />
              <Typography variant="body1" gutterBottom><strong>Created At:</strong> {formatTimestamp(currentTicket.createdAt)}</Typography>
              <Typography variant="body1" gutterBottom><strong>Updated At:</strong> {formatTimestamp(currentTicket.updatedAt)}</Typography>
              <Grid container spacing={1} justifyContent='flex-end'>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveEdit}
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
                    onClick={handleCloseEditModal}
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

      <Dialog
        open={isConfirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to change the status to "{statusToUpdate}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleUpdateStatus(statusToUpdate)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default ManageTicketsPage;
