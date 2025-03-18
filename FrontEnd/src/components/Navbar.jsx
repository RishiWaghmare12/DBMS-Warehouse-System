import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="header">
      <h1>Warehouse Management System</h1>
      <nav>
        <Link to="/warehouse" className="nav-link">Warehouse</Link>
        <Link to="/send-receive" className="nav-link">Send/Receive</Link>
        <Link to="/transactions" className="nav-link">Transactions</Link>
      </nav>
    </header>
  );
};

export default Navbar;
