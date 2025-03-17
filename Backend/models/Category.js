const { pool } = require('../config/db');

class Category {
  // Get all categories
  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM categories ORDER BY name');
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching categories: ${err.message}`);
    }
  }

  // Get category by ID
  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM categories WHERE category_id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error fetching category: ${err.message}`);
    }
  }

  // Update category capacity
  static async updateCapacity(id, capacityChange) {
    try {
      const result = await pool.query(
        'UPDATE categories SET current_capacity = current_capacity + $1 WHERE category_id = $2 RETURNING *',
        [capacityChange, id]
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error updating category capacity: ${err.message}`);
    }
  }

  // Get category with available space check
  static async checkAvailableSpace(id, requiredSpace) {
    try {
      const result = await pool.query(
        'SELECT *, (max_capacity - current_capacity) AS available_space FROM categories WHERE category_id = $1',
        [id]
      );
      
      const category = result.rows[0];
      if (!category) {
        throw new Error('Category not found');
      }
      
      return {
        ...category,
        hasSpace: category.available_space >= requiredSpace
      };
    } catch (err) {
      throw new Error(`Error checking category space: ${err.message}`);
    }
  }

  // Get all categories with their available space
  static async getAllWithAvailableSpace() {
    try {
      const result = await pool.query(
        'SELECT *, (max_capacity - current_capacity) AS available_space FROM categories ORDER BY name'
      );
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching categories with space: ${err.message}`);
    }
  }
}

module.exports = Category; 