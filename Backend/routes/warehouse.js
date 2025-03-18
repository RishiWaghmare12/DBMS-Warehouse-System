const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const { pool } = require('../config/db');

/**
 * @route   GET /api/warehouse
 * @desc    Get complete warehouse report with all compartments and items
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAllWithAvailableSpace();
    
    // For each category, get its items
    const warehouseData = await Promise.all(
      categories.map(async (category) => {
        const items = await Item.getByCategoryId(category.category_id);
        return {
          ...category,
          items
        };
      })
    );
    
    res.json({
      success: true,
      data: warehouseData
    });
  } catch (error) {
    console.error('Error fetching warehouse data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/warehouse/compartments
 * @desc    Get all compartments with their current items and quantities
 * @access  Public
 */
router.get('/compartments', async (req, res) => {
  try {
    const categories = await Category.getAll();
    const compartments = await Promise.all(
      categories.map(async (category) => {
        const items = await Item.getByCategoryId(category.category_id);
        return {
          ...category,
          items
        };
      })
    );
    
    res.json({
      success: true,
      data: compartments
    });
  } catch (error) {
    console.error('Error fetching compartments:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/warehouse/compartments/available
 * @desc    Get available space in each compartment
 * @access  Public
 */
router.get('/compartments/available', async (req, res) => {
  try {
    const compartments = await Category.getAllWithAvailableSpace();
    res.json({
      success: true,
      data: compartments
    });
  } catch (error) {
    console.error('Error fetching available space:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/warehouse/items/send
 * @desc    Process sending items out of the warehouse
 * @access  Public
 */
router.post('/items/send', async (req, res) => {
  try {
    const { item_id, quantity } = req.body;
    
    if (!item_id || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Item ID and quantity (positive number) are required'
      });
    }
    
    // Get the item and check if it has enough quantity
    const item = await Item.checkQuantityForSend(item_id, quantity);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    if (!item.hasEnoughQuantity) {
      return res.status(400).json({
        success: false,
        error: `Not enough quantity available. Requested: ${quantity}, Available: ${item.current_quantity}`,
        availableQuantity: item.current_quantity
      });
    }
    
    const updatedItem = await Item.updateQuantity(item_id, -quantity);
    
    await Transaction.create(item_id, quantity, 'SEND');
    
    res.json({
      success: true,
      message: `Successfully sent ${quantity} units of item ${updatedItem.name}`,
      data: {
        item: updatedItem,
        quantitySent: quantity
      }
    });
  } catch (error) {
    console.error('Error sending items:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/warehouse/items/receive
 * @desc    Process receiving items into the warehouse
 * @access  Public
 */
router.post('/items/receive', async (req, res) => {
  try {
    const { item_id, category_id, name, quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity (positive number) is required'
      });
    }
    
    let targetItem;
    
    // If item_id is provided, we're receiving an existing item
    if (item_id) {
      // Check if the item exists
      targetItem = await Item.getById(item_id);
      if (!targetItem) {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      
      // Check if the item has space
      const itemSpaceCheck = await Item.checkSpaceForReceive(item_id, quantity);
      if (!itemSpaceCheck.hasSpace) {
        return res.status(400).json({
          success: false,
          error: `Item has reached its maximum capacity. Available space: ${itemSpaceCheck.availableSpace}`,
          availableSpace: itemSpaceCheck.availableSpace
        });
      }
      
      // Check if the category has space
      const categorySpaceCheck = await Category.checkAvailableSpace(targetItem.category_id, quantity);
      if (!categorySpaceCheck.hasSpace) {
        return res.status(400).json({
          success: false,
          error: `Compartment has reached its maximum capacity. Available space: ${categorySpaceCheck.available_space}`,
          availableSpace: categorySpaceCheck.available_space
        });
      }
    } 
    else if (category_id && name) {
      // Check if the category exists
      const category = await Category.getById(category_id);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }
      
      const categorySpaceCheck = await Category.checkAvailableSpace(category_id, quantity);
      if (!categorySpaceCheck.hasSpace) {
        return res.status(400).json({
          success: false,
          error: `Compartment has reached its maximum capacity. Available space: ${categorySpaceCheck.available_space}`,
          availableSpace: categorySpaceCheck.available_space
        });
      }
      
      if (quantity > 100) {
        return res.status(400).json({
          success: false,
          error: `Cannot receive more than maximum item capacity (100 units). Requested: ${quantity}`,
          maxItemCapacity: 100
        });
      }
      
      targetItem = await Item.create(name, category_id);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Either item_id or both category_id and name are required'
      });
    }
    
    const updatedItem = await Item.updateQuantity(targetItem.item_id, quantity);
    
    await Transaction.create(updatedItem.item_id, quantity, 'RECEIVE');
    
    res.json({
      success: true,
      message: `Successfully received ${quantity} units of item ${updatedItem.name}`,
      data: {
        item: updatedItem,
        quantityReceived: quantity
      }
    });
  } catch (error) {
    console.error('Error receiving items:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 