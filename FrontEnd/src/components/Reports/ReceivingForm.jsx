import React, { useState } from 'react';
import { warehouseApi } from '../../services/api';

const ReceivingForm = ({ onReceiveSuccess }) => {
  const [formData, setFormData] = useState({
    item_id: '',
    category_id: '',
    name: '',
    quantity: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await warehouseApi.receiveItems({
        ...formData,
        quantity: parseInt(formData.quantity),
      });

      if (response.success) {
        setFormData({
          item_id: '',
          category_id: '',
          name: '',
          quantity: '',
        });
        if (onReceiveSuccess) onReceiveSuccess();
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Receive Items</h3>
      <div className="form-group">
        <label htmlFor="category_id">Compartment ID:</label>
        <input
          type="number"
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="name">Item Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          required
        />
      </div>
      {error && <div className="error-report">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Receive Items'}
      </button>
    </form>
  );
};

export default ReceivingForm;
