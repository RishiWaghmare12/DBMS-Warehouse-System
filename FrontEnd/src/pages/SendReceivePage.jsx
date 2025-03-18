import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SendReceivePage = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/items');
      setItems(response.data);
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setQuantity('');
    setError('');
    setSuccess('');
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleSend = async () => {
    if (!selectedItem || !quantity) {
      setError('Please select an item and enter quantity');
      return;
    }

    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (numQuantity > selectedItem.currentQuantity) {
      setError('Cannot send more items than available');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/transactions/send', {
        itemId: selectedItem.id,
        quantity: numQuantity
      });
      setSuccess(`Successfully sent ${numQuantity} items`);
      fetchItems(); // Refresh items list
      setSelectedItem(null);
      setQuantity('');
    } catch (err) {
      setError('Failed to send items');
    }
  };

  const handleReceive = async () => {
    if (!selectedItem || !quantity) {
      setError('Please select an item and enter quantity');
      return;
    }

    const numQuantity = parseInt(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (numQuantity + selectedItem.currentQuantity > selectedItem.maxQuantity) {
      setError('Cannot receive more items than maximum capacity');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/transactions/receive', {
        itemId: selectedItem.id,
        quantity: numQuantity
      });
      setSuccess(`Successfully received ${numQuantity} items`);
      fetchItems(); // Refresh items list
      setSelectedItem(null);
      setQuantity('');
    } catch (err) {
      setError('Failed to receive items');
    }
  };

  return (
    <div className="send-receive-page">
      <h2>Send/Receive Items</h2>
      
      <div className="item-selection">
        <h3>Select Item</h3>
        <select 
          value={selectedItem?.id || ''} 
          onChange={(e) => handleItemSelect(items.find(item => item.id === parseInt(e.target.value)))}
        >
          <option value="">Select an item...</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.currentQuantity}/{item.maxQuantity})
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <div className="item-details">
          <h3>Item Details</h3>
          <p>Name: {selectedItem.name}</p>
          <p>Compartment: {selectedItem.compartmentName}</p>
          <p>Current Status: {selectedItem.currentQuantity}/{selectedItem.maxQuantity}</p>
          <p>Available Space: {selectedItem.maxQuantity - selectedItem.currentQuantity}</p>
        </div>
      )}

      <div className="quantity-input">
        <h3>Enter Quantity</h3>
        <input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Enter quantity"
          min="1"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="action-buttons">
        <button onClick={handleSend} className="send-button">Send Items</button>
        <button onClick={handleReceive} className="receive-button">Receive Items</button>
      </div>
    </div>
  );
};

export default SendReceivePage; 