import React, { useState, useEffect } from 'react';
import Compartment from './Compartment';
import { warehouseApi } from '../../services/api';

const CompartmentList = () => {
  const [compartments, setCompartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  const fetchWarehouseData = async () => {
    try {
      setLoading(true);
      const response = await warehouseApi.getWarehouseReport();
      if (response.success) {
        // Sort compartments by category_id for consistent display
        const sortedData = response.data.sort((a, b) => a.category_id - b.category_id);
        setCompartments(sortedData);
      } else {
        setError('Failed to fetch warehouse data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      <p>Loading warehouse data...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-report">
      <h3>Error Loading Data</h3>
      <p>{error}</p>
      <button onClick={fetchWarehouseData}>Retry</button>
    </div>
  );

  return (
    <div className="warehouse-content">
      <div className="warehouse-header">
        <h2>Warehouse Compartments</h2>
        <button onClick={fetchWarehouseData} className="refresh-button">
          Refresh Data
        </button>
      </div>
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
