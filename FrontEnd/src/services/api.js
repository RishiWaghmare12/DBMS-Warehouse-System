const API_BASE_URL = 'http://localhost:3000/api';

export const warehouseApi = {
  // Get complete warehouse report
  getWarehouseReport: async () => {
    const response = await fetch(`${API_BASE_URL}/warehouse`);
    if (!response.ok) throw new Error('Failed to fetch warehouse report');
    return response.json();
  },

  // Get all compartments with items
  getCompartments: async () => {
    const response = await fetch(`${API_BASE_URL}/warehouse/compartments`);
    if (!response.ok) throw new Error('Failed to fetch compartments');
    return response.json();
  },

  // Get available space in compartments
  getAvailableSpace: async () => {
    const response = await fetch(`${API_BASE_URL}/warehouse/compartments/available`);
    if (!response.ok) throw new Error('Failed to fetch available space');
    return response.json();
  },

  // Receive items (new or existing)
  receiveItems: async (itemData) => {
    const response = await fetch(`${API_BASE_URL}/warehouse/items/receive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to receive items');
    }
    return response.json();
  },

  // Send items
  sendItems: async (itemData) => {
    const response = await fetch(`${API_BASE_URL}/warehouse/items/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send items');
    }
    return response.json();
  },
};
