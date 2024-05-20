import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  TextField,
  Divider,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TicketViewModal, TicketEditModal } from './Modal';
import CardTicket from './CardTicket';

const statusColors = {
  pending: '#FFEBEE',    // light red
  accepted: '#E3F2FD',   // light blue
  resolved: '#E8F5E9',   // light green
  rejected: '#F3E5F5',   // light purple
};

const KanbanColumn = styled(Box)(({ theme, status }) => ({
  backgroundColor: statusColors[status] || theme.palette.background.default,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  minHeight: '400px',
  flex: '1',
  marginRight: theme.spacing(2),
  position: 'relative',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
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

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:7001/tickets?sort=${sort}&filter=${filter}&searchTerm=${searchTerm}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets: ', error);
      }
    };
    fetchTickets();
  }, [sort, filter, searchTerm]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:7001/updateTicketStatus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const response = await fetch(`http://localhost:7001/tickets?sort=${sort}&filter=${filter}&searchTerm=${searchTerm}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error updating ticket: ', error);
    }
  };

  const updateTicketDetails = async (id, details) => {
    try {
      await fetch(`http://localhost:7001/updateTicketDetails/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      setTickets(tickets.map((ticket) => (ticket.id === id ? { ...ticket, ...details } : ticket)));
    } catch (error) {
      console.error('Error updating ticket: ', error);
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
        contact: currentTicket.contact,
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
    if (source.droppableId !== destination.droppableId) {
      const ticket = tickets.find((ticket) => ticket.id === result.draggableId);
      if (ticket) {
        handleUpdateStatus(ticket.id, destination.droppableId);
      }
    }
  };

  const renderTickets = (status) => {
    return tickets
      .filter((ticket) => ticket.status === status)
      .map((ticket, index) => (
        <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <CardTicket
                ticket={ticket}
                handleViewClick={handleViewClick}
                handleEditClick={handleEditClick}
                handleUpdateStatus={handleUpdateStatus}
              />
            </div>
          )}
        </Draggable>
      ));
  };

  return (
    <>
      <Grid container spacing={2} alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4" gutterBottom>
            Manage Tickets
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
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
          {['pending', 'accepted', 'resolved', 'rejected'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <KanbanColumn ref={provided.innerRef} {...provided.droppableProps} status={status}>
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

      <TicketViewModal open={isViewModalOpen} onClose={handleCloseViewModal} ticket={currentTicket} />

      <TicketEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        ticket={currentTicket}
        onChange={setCurrentTicket}
        onSave={handleSaveEdit}
        isModified={isModified}
      />
    </>
  );
};

export default ManageTicketsPage;
