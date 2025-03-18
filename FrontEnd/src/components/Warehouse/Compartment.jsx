import React from 'react';

const Compartment = ({ id, name, capacity, currentItems, items = [] }) => {
  const occupancyPercentage = (currentItems / capacity) * 100;
  const itemName = items.length > 0 ? items[0].name : 'Empty';
  const itemQuantity = items.length > 0 ? items[0].current_quantity : 0;

  return (
    <div className="compartment">
      <h3>Compartment {id}</h3>
      <div className="compartment-info">
        <p>Item Name: {itemName}</p>
        <p>Item Quantity: {itemQuantity}</p>
        <p>Total Capacity: {capacity}</p>
        <p>Space Used: {currentItems}</p>
        <div className="occupancy-bar">
          <div 
            className={`occupancy-fill ${occupancyPercentage > 90 ? 'danger' : occupancyPercentage > 70 ? 'warning' : ''}`}
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Compartment;
