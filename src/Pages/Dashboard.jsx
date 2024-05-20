import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { db, collection, query, orderBy, onSnapshot, limit } from '../Firebase';
import { Container, Typography, Grid, Card, CardContent, Box, Fab, Modal } from '@mui/material';
import TicketList from '../components/ticket/ManageTickets.jsx';
import CreateTicketForm from '../components/ticket/CreateNewTicket.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    resolved: 0,
    rejected: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'tickets'), orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map((doc) => doc.data());
      const newStats = {
        pending: tickets.filter((ticket) => ticket.status === 'pending').length,
        accepted: tickets.filter((ticket) => ticket.status === 'accepted').length,
        resolved: tickets.filter((ticket) => ticket.status === 'resolved').length,
        rejected: tickets.filter((ticket) => ticket.status === 'rejected').length,
      };
      setStats(newStats);

      const recentTicketsData = snapshot.docs.slice(0, 5).map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecentTickets(recentTicketsData);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Box mt={3} mb={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#f9c74f', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>Pending</Typography>
                <Typography variant="h4" component="p" color="primary">{stats.pending}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#90be6d', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>Accepted</Typography>
                <Typography variant="h4" component="p" color="success">{stats.accepted}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#4d908e', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>Resolved</Typography>
                <Typography variant="h4" component="p" color="textSecondary">{stats.resolved}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ backgroundColor: '#f94144', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h5" component="h2" color="textSecondary" gutterBottom>Rejected</Typography>
                <Typography variant="h4" component="p" color="textSecondary">{stats.rejected}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <TicketList tickets={recentTickets} />

      <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={handleOpenModal}>
        <AddIcon />
      </Fab>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, p: 4 }}>
          <CreateTicketForm onClose={handleCloseModal} />
        </Box>
      </Modal>
    </>
  );
};

export default Dashboard;
