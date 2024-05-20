import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import NewTicket from './components/ticket/CreateNewTicket';


const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets/new" element={<NewTicket />} />
  
        </Routes>
      </div>
    </Router>
  );
};

export default App;
