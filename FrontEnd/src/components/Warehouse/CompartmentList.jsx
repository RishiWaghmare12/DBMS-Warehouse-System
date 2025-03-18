import React, { useState, useEffect } from 'react';
import Compartment from './Compartment';
import { warehouseApi } from '../../services/api';

const CompartmentList = () => {
  const [compartments, setCompartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompartments();
  }, []);

  const fetchCompartments = async () => {
    try {
      setLoading(true);
      const response = await warehouseApi.getCompartments();
      if (response.success) {
        setCompartments(response.data);
      } else {
        setError('Failed to fetch compartments');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading compartments...</div>;
  if (error) return <div className="error-report">{error}</div>;

  return (
    <div className="compartment-list">
      <h2>Warehouse Compartments</h2>
      <div className="compartments-grid">
        {compartments.map((compartment) => (
          <Compartment
            key={compartment.category_id}
            id={compartment.category_id}
            name={compartment.name}
            capacity={compartment.max_capacity}
            currentItems={compartment.current_capacity}
            items={compartment.items}
          />
        ))}
      </div>
    </div>
  );
};

export default CompartmentList;
