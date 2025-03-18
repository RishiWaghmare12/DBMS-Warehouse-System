import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import WarehousePage from './pages/WarehousePage';
import SendReceivePage from './pages/SendReceivePage';
import TransactionsPage from './pages/TransactionsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/warehouse" element={<WarehousePage />} />
            <Route path="/send-receive" element={<SendReceivePage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
