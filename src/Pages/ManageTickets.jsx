import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp } from '../Firebase';
import { Container, Typography, Select, MenuItem, Button, Grid, Box } from '@mui/material';

const ManageTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('updatedAt');

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

  const filteredTickets = tickets.filter(ticket => filter === 'all' || ticket.status === filter);

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

  return (
    <Container>
      <Typography variant="h2" gutterBottom>Manage Tickets</Typography>
      <Grid container spacing={2} alignItems="center" sx={{
        marginBottom: '16px',
        '& .MuiSelect-root': {
          padding: '8px',
        },
      
      }}>
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
            <MenuItem value="updatedAt">Latest Update</MenuItem>
            <MenuItem value="createdAt">Created Time</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {filteredTickets.map(ticket => (
          <Grid item xs={6} key={ticket.id}>
            <Box className="ticket" sx={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>
              <Typography variant="h4">{ticket.title}</Typography>
              <Typography variant="body1">{ticket.description}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {ticket.status}</Typography>
              <Typography variant="body1"><strong>Contact:</strong> {ticket.contact}</Typography>
              <Typography variant="body1"><strong>Created At:</strong> {formatTimestamp(ticket.createdAt)}</Typography>
              <Typography variant="body1"><strong>Updated At:</strong> {formatTimestamp(ticket.updatedAt)}</Typography>
              <div className="ticket-actions" style={{ textAlign: 'left' }}>
                <Button onClick={() => updateTicketStatus(ticket.id, 'pending')} variant="outlined" sx={{ ...(ticket.status === 'pending' && getStatusButtonStyle('pending')), marginRight: '8px' }}>Pending</Button>
                <Button onClick={() => updateTicketStatus(ticket.id, 'accepted')} variant="outlined" sx={{ ...(ticket.status === 'accepted' && getStatusButtonStyle('accepted')), marginRight: '8px' }}>Accepted</Button>
                <Button onClick={() => updateTicketStatus(ticket.id, 'resolved')} variant="outlined" sx={{ ...(ticket.status === 'resolved' && getStatusButtonStyle('resolved')), marginRight: '8px' }}>Resolved</Button>
                <Button onClick={() => updateTicketStatus(ticket.id, 'rejected')} variant="outlined" sx={{ ...(ticket.status === 'rejected' && getStatusButtonStyle('rejected')), marginRight: '8px' }}>Rejected</Button>
              </div>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ManageTicketsPage;
