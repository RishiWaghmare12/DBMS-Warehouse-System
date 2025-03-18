const { pool } = require('../config/db');

class Item {
  // Get all items
  static async getAll() {
    try {
      const result = await pool.query(`
        SELECT i.*, c.name as category_name 
        FROM items i
        JOIN categories c ON i.category_id = c.category_id
        ORDER BY i.name
      `);
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching items: ${err.message}`);
    }
  }

  // Get item by ID
  static async getById(id) {
    try {
      const result = await pool.query(`
        SELECT i.*, c.name as category_name 
        FROM items i
        JOIN categories c ON i.category_id = c.category_id
        WHERE i.item_id = $1
      `, [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error fetching item: ${err.message}`);
    }
  }

  // Get items by category ID
  static async getByCategoryId(categoryId) {
    try {
      const result = await pool.query(`
        SELECT i.*, c.name as category_name 
        FROM items i
        JOIN categories c ON i.category_id = c.category_id
        WHERE i.category_id = $1
        ORDER BY i.name
      `, [categoryId]);
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching items by category: ${err.message}`);
    }
  }

  // Create a new item
  static async create(name, categoryId, maxQuantity = 100, initialQuantity = 0) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      const result = await client.query(`
        INSERT INTO items (name, category_id, max_quantity, current_quantity) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
      `, [name, categoryId, maxQuantity, initialQuantity]);
      
      // If initial quantity > 0, update category capacity
      if (initialQuantity > 0) {
        await client.query(`
          UPDATE categories
          SET current_capacity = current_capacity + $1
          WHERE category_id = $2
        `, [initialQuantity, categoryId]);
      }
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating item: ${err.message}`);
    } finally {
      client.release();
    }
  }

  // Update item quantity
  static async updateQuantity(id, quantityChange) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Get current item to know its category
      const itemQuery = await client.query('SELECT * FROM items WHERE item_id = $1', [id]);
      const item = itemQuery.rows[0];
      
      if (!item) {
        throw new Error('Item not found');
      }
      
      // Update item quantity
      const result = await client.query(`
        UPDATE items 
        SET current_quantity = current_quantity + $1 
        WHERE item_id = $2 
        RETURNING *
      `, [quantityChange, id]);
      
      // Update category capacity
      await client.query(`
        UPDATE categories
        SET current_capacity = current_capacity + $1
        WHERE category_id = $2
      `, [quantityChange, item.category_id]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(`Error updating item quantity: ${err.message}`);
    } finally {
      client.release();
    }
  }

  // Check if item has enough quantity for sending
  static async checkQuantityForSend(id, requestedQuantity) {
    try {
      const result = await pool.query(
        'SELECT *, (current_quantity - $1) AS remaining_after_send FROM items WHERE item_id = $2',
        [requestedQuantity, id]
      );
      
      const item = result.rows[0];
      if (!item) {
        throw new Error('Item not found');
      }
      
      return {
        ...item,
        hasEnoughQuantity: item.current_quantity >= requestedQuantity,
        remainingAfterSend: Math.max(0, item.remaining_after_send)
      };
    } catch (err) {
      throw new Error(`Error checking item quantity: ${err.message}`);
    }
  }

  // Check if item has space for receiving
  static async checkSpaceForReceive(id, requestedQuantity) {
    try {
      const result = await pool.query(
        'SELECT *, (max_quantity - current_quantity) AS available_space FROM items WHERE item_id = $1',
        [id]
      );
      
      const item = result.rows[0];
      if (!item) {
        throw new Error('Item not found');
      }
      
      return {
        ...item,
        hasSpace: item.available_space >= requestedQuantity,
        availableSpace: item.available_space
      };
    } catch (err) {
      throw new Error(`Error checking item space: ${err.message}`);
    }
  }
}

module.exports = Item; 