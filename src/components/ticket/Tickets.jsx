import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, onSnapshot } from '../../Firebase';
// import '../components/ticket/ticket.css';
import { Container, Typography, Select, MenuItem, Grid } from '@mui/material';

const TicketsPage = () => {
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

  return (
    <Container>
      
      <Grid container spacing={2} alignItems="center">
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
      <br />
      <Grid container spacing={2}>
        {filteredTickets.map(ticket => (
          <Grid item xs={12} key={ticket.id}>
            <div className="ticket">
              <Typography variant="h4">{ticket.title}</Typography>
              <Typography variant="body1">{ticket.description}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {ticket.status}</Typography>
              <Typography variant="body1"><strong>Contact:</strong> {ticket.contact}</Typography>
              <Typography variant="body1"><strong>Created At:</strong> {new Date(ticket.createdAt.seconds * 1000).toLocaleString()}</Typography>
              <Typography variant="body1"><strong>Updated At:</strong> {new Date(ticket.updatedAt.seconds * 1000).toLocaleString()}</Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TicketsPage;
