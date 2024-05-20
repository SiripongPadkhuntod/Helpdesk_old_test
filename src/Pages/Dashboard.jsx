import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
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
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:7001/tickets?sort=updatedAt&filter=all&searchTerm=');
        const data = await response.json();
        
        const newStats = {
          pending: data.filter((ticket) => ticket.status === 'pending').length,
          accepted: data.filter((ticket) => ticket.status === 'accepted').length,
          resolved: data.filter((ticket) => ticket.status === 'resolved').length,
          rejected: data.filter((ticket) => ticket.status === 'rejected').length,
        };
        setStats(newStats);

        const recentTicketsData = data.slice(0, 5).map((ticket) => ({
          id: ticket.id,
          ...ticket,
        }));
        setRecentTickets(recentTicketsData);
      } catch (error) {
        console.error("Error fetching tickets: ", error);
      }
    };

    fetchTickets();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container maxWidth="xl">
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
    </Container>
  );
};

export default Dashboard;
