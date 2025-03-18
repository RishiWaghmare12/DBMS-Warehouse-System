import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WarehousePage from './pages/WarehousePage';
import ReceivingPage from './pages/ReceivingPage';
import SendingPage from './pages/SendingPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Warehouse Management System</h1>
          <nav>
            <Link to="/" className="nav-link">Warehouse</Link>
            <Link to="/receive" className="nav-link">Receive</Link>
            <Link to="/send" className="nav-link">Send</Link>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<WarehousePage />} />
            <Route path="/receive" element={<ReceivingPage />} />
            <Route path="/send" element={<SendingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
