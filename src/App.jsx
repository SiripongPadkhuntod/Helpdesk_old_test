import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './Pages/Auth';
import Dashboard from './Pages/Dashboard';
import NewTicket from './components/ticket/CreateNewTicket';
import Ticket from './components/ticket/Tickets';
import ManageTicketsPage from './components/ticket/ManageTickets';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/auth" element={<AuthPage />} /> {/* เพิ่ม Route ของ AuthPage */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets/new" element={<NewTicket />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="/management" element={<ManageTicketsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
