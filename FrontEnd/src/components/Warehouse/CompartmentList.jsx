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
      
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        // Handle nested data structure - response.data.data is the actual array
        const compartmentsData = response.data.data || response.data;
        
        if (Array.isArray(compartmentsData)) {
          setCompartments(compartmentsData);
          setError(null);
        } else {
          console.error('Data is not an array:', compartmentsData);
          setCompartments([]);
          setError('Invalid data format received');
        }
      } else {
        setError('Failed to fetch warehouse data');
        setCompartments([]);
      }
    } catch (err) {
      console.error('Error fetching warehouse data:', err);
      setError(err.message);
      setCompartments([]);
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
            key={compartment.id}
            id={compartment.id}
            name={compartment.name}
            capacity={compartment.maxCapacity}
            currentItems={compartment.currentCapacity}
            items={compartment.items.map(item => ({
              item_id: item.id,
              name: item.name,
              current_quantity: item.currentQuantity,
              max_quantity: item.maxQuantity
            }))}
          />
        ))}
      </div>
    </div>
  );
};

export default CompartmentList;
