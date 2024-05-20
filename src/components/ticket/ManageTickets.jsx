import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from '../../Firebase';
import { Container, Typography, Grid, Box, Paper, Button, IconButton, TextField, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { TicketViewModal, TicketEditModal } from './Modal';
import CardTicket from './CardTicket';

const KanbanColumn = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  minHeight: '400px',
  flex: '1',
  maxHeight: '700px',
  overflowY: 'auto',
  marginRight: theme.spacing(2),
  position: 'relative',
}));

const KanbanHeader = styled(Typography)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.background.default,
  zIndex: 1,
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ScrollableContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  padding: theme.spacing(2),
  '&::-webkit-scrollbar': {
    height: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: theme.shape.borderRadius,
  },
}));

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

  const handleUpdateStatus = async (id, status) => {
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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If the ticket was moved to a different column
    if (source.droppableId !== destination.droppableId) {
      const ticket = tickets.find(ticket => ticket.id === result.draggableId);
      if (ticket) {
        handleUpdateStatus(ticket.id, destination.droppableId);
      }
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setCurrentTicket(null);
    setStatusToUpdate(null);
  };

  const renderTickets = (status) => {
    return filteredTickets.filter(ticket => ticket.status === status).map((ticket, index) => (
      <CardTicket
        key={ticket.id}
        ticket={ticket}
        index={index}
        handleViewClick={handleViewClick}
        handleEditClick={handleEditClick}
        handleUpdateStatus={handleUpdateStatus}
      />
    ));
  };

  return (
    <Container maxWidth>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" gutterBottom>Manage Tickets</Typography>
        </Grid>

        <Grid item xs={6}>
          <Grid container spacing={2} alignItems="center" justifyContent='flex-end'>
            <Grid item>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} fullWidth>
                <MenuItem value="createdAt">Created Time</MenuItem>
                <MenuItem value="updatedAt">Latest Update</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={5}>
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
        </Grid>
      </Grid>

      <Divider sx={{ margin: '16px' }} />

      <DragDropContext onDragEnd={onDragEnd}>
        <ScrollableContainer>
          {['pending', 'accepted', 'resolved', 'rejected'].map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <KanbanColumn ref={provided.innerRef} {...provided.droppableProps}>
                  <KanbanHeader variant="h6" gutterBottom>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </KanbanHeader>
                  {renderTickets(status)}
                  {provided.placeholder}
                </KanbanColumn>
              )}
            </Droppable>
          ))}
        </ScrollableContainer>
      </DragDropContext>

      <TicketViewModal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        ticket={currentTicket}
      />

      <TicketEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        ticket={currentTicket}
        onChange={setCurrentTicket}
        onSave={handleSaveEdit}
        isModified={isModified}
      />

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
          <Button onClick={() => handleUpdateStatus(currentTicket.id, statusToUpdate)} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageTicketsPage;
