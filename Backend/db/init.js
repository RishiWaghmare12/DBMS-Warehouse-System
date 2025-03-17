const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const initDB = async () => {
  try {
    const sqlSetup = fs.readFileSync(
      path.join(__dirname, 'setup.sql'),
      'utf8'
    );

    await pool.query(sqlSetup);
    console.log('Database tables created or already exist');

    const categoriesCount = await pool.query('SELECT COUNT(*) FROM categories');
    
    if (parseInt(categoriesCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO categories (name, max_capacity) VALUES 
        ('Electronics', 1000),
        ('Appliances', 1000),
        ('Furniture', 1000),
        ('Clothing', 1000),
        ('Books', 1000);
      `);
      console.log('Default categories added');
    }

  } catch (err) {
    console.error('Database initialization error:', err.message);
    process.exit(1);
  }
};

module.exports = initDB; 