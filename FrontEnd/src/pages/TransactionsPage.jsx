import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/transactions');
      // Check if response.data is an array before sorting
      if (Array.isArray(response.data)) {
        const sortedTransactions = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sortedTransactions);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // If the data is nested inside a data property
        const sortedTransactions = response.data.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTransactions(sortedTransactions);
      } else {
        // If data is not in expected format
        console.error('Unexpected response format:', response.data);
        setTransactions(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="transactions-page">
      <h2>Transaction History</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="transactions-list">
        {transactions.length > 0 ? (
          transactions.map(transaction => (
            <div 
              key={transaction.id} 
              className={`transaction-card ${transaction.type ? transaction.type.toLowerCase() : ''}`}
            >
              <div className="transaction-header">
                <h3>{transaction.type}</h3>
                <span className="transaction-date">{formatDate(transaction.createdAt || new Date())}</span>
              </div>
              
              <div className="transaction-details">
                <p><strong>Item:</strong> {transaction.itemName}</p>
                <p><strong>Item ID:</strong> {transaction.itemId}</p>
                <p><strong>Quantity:</strong> {transaction.quantity}</p>
                <p><strong>Final Amount:</strong> {transaction.finalQuantity}/{transaction.maxQuantity}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-transactions">No transactions found</div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
