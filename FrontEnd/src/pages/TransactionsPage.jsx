import React, { useState, useEffect } from 'react';
import { warehouseApi } from '../services/api';
import '../App.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    type: 'ALL',
    itemId: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let response;

      if (filter.type !== 'ALL' && filter.type) {
        response = await warehouseApi.getTransactionsByType(filter.type);
      } else if (filter.itemId) {
        response = await warehouseApi.getTransactionsByItem(filter.itemId);
      } else {
        response = await warehouseApi.getAllTransactions();
      }

      if (response.success) {
        setTransactions(response.data);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilter = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  const clearFilter = () => {
    setFilter({
      type: 'ALL',
      itemId: ''
    });
    fetchTransactions();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Loading transactions...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-report">
      <h3>Error Loading Data</h3>
      <p>{error}</p>
      <button onClick={fetchTransactions}>Retry</button>
    </div>
  );

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h2>Transaction History</h2>
        <button onClick={fetchTransactions} className="refresh-button">
          Refresh
        </button>
      </div>

      <div className="transaction-filters">
        <form onSubmit={applyFilter}>
          <div className="filter-row">
            <div className="filter-group">
              <label htmlFor="type">Transaction Type:</label>
              <select
                id="type"
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
              >
                <option value="ALL">All Transactions</option>
                <option value="RECEIVE">Receive Only</option>
                <option value="SEND">Send Only</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="itemId">Item ID:</label>
              <input
                type="number"
                id="itemId"
                name="itemId"
                value={filter.itemId}
                onChange={handleFilterChange}
                placeholder="Enter Item ID"
              />
            </div>

            <div className="filter-actions">
              <button type="submit" className="filter-btn">
                Apply Filter
              </button>
              <button type="button" className="clear-btn" onClick={clearFilter}>
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {transactions.length === 0 ? (
        <div className="no-transactions">
          <p>No transactions found with the selected filters.</p>
        </div>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className={transaction.type.toLowerCase()}>
                  <td>{transaction.id}</td>
                  <td>
                    <span className={`badge ${transaction.type.toLowerCase()}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td>{transaction.item_id}</td>
                  <td>{transaction.item_name}</td>
                  <td>{transaction.quantity}</td>
                  <td>{formatDate(transaction.transaction_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
