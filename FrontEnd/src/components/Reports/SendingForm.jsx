import React, { useState } from 'react';
import { warehouseApi } from '../../services/api';

const SendingForm = ({ onSendSuccess }) => {
  const [formData, setFormData] = useState({
    item_id: '',
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
      const response = await warehouseApi.sendItems({
        ...formData,
        quantity: parseInt(formData.quantity),
      });

      if (response.success) {
        setFormData({
          item_id: '',
          quantity: '',
        });
        if (onSendSuccess) onSendSuccess();
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
      <h3>Send Items</h3>
      <div className="form-group">
        <label htmlFor="item_id">Item ID:</label>
        <input
          type="number"
          id="item_id"
          name="item_id"
          value={formData.item_id}
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
        {loading ? 'Processing...' : 'Send Items'}
      </button>
    </form>
  );
};

export default SendingForm;
