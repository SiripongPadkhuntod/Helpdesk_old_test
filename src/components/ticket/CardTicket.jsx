import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton,Dialog,DialogActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CancelIcon from '@mui/icons-material/Cancel';
import { Draggable } from 'react-beautiful-dnd';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[3],
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const formatTimestamp = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
};

const CardTicket = ({ ticket, index, handleViewClick, handleEditClick, handleUpdateStatus }) => {
  return (
    
    <Draggable key={ticket.id} draggableId={ticket.id} index={parseInt(index, 10)}>



      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <StyledCard onClick={() => handleViewClick(ticket)}>
            <CardContent>
              <Typography variant="h6" noWrap>{ticket.title}</Typography>
              <Typography variant="body1" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {ticket.description}
              </Typography>
              <Typography variant="body2" noWrap><strong>Status:</strong> {ticket.status}</Typography>
              <Typography variant="body2" noWrap><strong>Contact:</strong> {ticket.contact}</Typography>
              <Typography variant="body2" noWrap><strong>Created At:</strong> {formatTimestamp(ticket.createdAt)}</Typography>
              <Typography variant="body2" noWrap><strong>Updated At:</strong> {formatTimestamp(ticket.updatedAt)}</Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={(e) => { e.stopPropagation(); handleEditClick(ticket); }} sx={{ marginLeft: 'auto' }}>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(ticket.id, 'accepted'); }}
                sx={{ color: 'green' }}
              >
                <CheckCircleIcon />
              </IconButton>
              
              <IconButton
                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(ticket.id, 'resolved'); }}
                sx={{ color: 'blue' }}
              >
                <DoneAllIcon />
              </IconButton>

              <IconButton
                onClick={(e) => { e.stopPropagation(); handleUpdateStatus(ticket.id, 'rejected'); }}
                sx={{ color: 'red' }}
              >
                <CancelIcon />
              </IconButton>
            </CardActions>
          </StyledCard>
        </div>
      )}
     
    </Draggable>
    
  );
};

export default CardTicket;
