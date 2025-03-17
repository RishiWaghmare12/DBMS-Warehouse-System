const { pool } = require('../config/db');

class Transaction {
  static async create(itemId, quantity, type) {
    try {
      const result = await pool.query(`
        INSERT INTO transactions (item_id, quantity, transaction_type) 
        VALUES ($1, $2, $3) 
        RETURNING *
      `, [itemId, quantity, type]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error creating transaction: ${err.message}`);
    }
  }

  // Get all transactions
  static async getAll() {
    try {
      const result = await pool.query(`
        SELECT t.*, i.name as item_name, c.name as category_name
        FROM transactions t
        JOIN items i ON t.item_id = i.item_id
        JOIN categories c ON i.category_id = c.category_id
        ORDER BY t.transaction_date DESC
      `);
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching transactions: ${err.message}`);
    }
  }

  // Get transactions by item ID
  static async getByItemId(itemId) {
    try {
      const result = await pool.query(`
        SELECT t.*, i.name as item_name
        FROM transactions t
        JOIN items i ON t.item_id = i.item_id
        WHERE t.item_id = $1
        ORDER BY t.transaction_date DESC
      `, [itemId]);
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching transactions for item: ${err.message}`);
    }
  }

  // Get transactions by category ID
  static async getByCategoryId(categoryId) {
    try {
      const result = await pool.query(`
        SELECT t.*, i.name as item_name, c.name as category_name
        FROM transactions t
        JOIN items i ON t.item_id = i.item_id
        JOIN categories c ON i.category_id = c.category_id
        WHERE c.category_id = $1
        ORDER BY t.transaction_date DESC
      `, [categoryId]);
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching transactions for category: ${err.message}`);
    }
  }

  // Get transactions by type (SEND or RECEIVE)
  static async getByType(type) {
    try {
      const result = await pool.query(`
        SELECT t.*, i.name as item_name, c.name as category_name
        FROM transactions t
        JOIN items i ON t.item_id = i.item_id
        JOIN categories c ON i.category_id = c.category_id
        WHERE t.transaction_type = $1
        ORDER BY t.transaction_date DESC
      `, [type]);
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching ${type} transactions: ${err.message}`);
    }
  }
}

module.exports = Transaction; 