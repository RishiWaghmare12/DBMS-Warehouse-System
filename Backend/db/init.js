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
        INSERT INTO categories (name, max_capacity, current_capacity) VALUES 
        ('Electronics', 1000, 0),
        ('Appliances', 1000, 0),
        ('Furniture', 1000, 0),
        ('Clothing', 1000, 0),
        ('Books', 1000, 0);
      `);
      console.log('Default categories added');

      const categories = await pool.query('SELECT * FROM categories');
      
      const predefinedItems = {
        'Electronics': [
          { name: 'Laptop', quantity: 45 },
          { name: 'Smartphone', quantity: 75 },
          { name: 'Tablet', quantity: 30 }
        ],
        'Appliances': [
          { name: 'Refrigerator', quantity: 15 },
          { name: 'Microwave', quantity: 25 },
          { name: 'Washing Machine', quantity: 10 }
        ],
        'Furniture': [
          { name: 'Office Chair', quantity: 20 },
          { name: 'Desk', quantity: 15 },
          { name: 'Bookshelf', quantity: 10 }
        ],
        'Clothing': [
          { name: 'T-Shirts', quantity: 60 },
          { name: 'Jeans', quantity: 40 },
          { name: 'Jackets', quantity: 25 }
        ],
        'Books': [
          { name: 'Fiction', quantity: 80 },
          { name: 'Non-Fiction', quantity: 65 },
          { name: 'Technical', quantity: 50 }
        ]
      };
      
      for (const category of categories.rows) {
        const items = predefinedItems[category.name] || [];
        let categoryCapacity = 0;
        
        for (const item of items) {
          const newItem = await pool.query(`
            INSERT INTO items (name, category_id, max_quantity, current_quantity)
            VALUES ($1, $2, $3, $4)
            RETURNING *
          `, [item.name, category.category_id, 100, item.quantity]);
          
          await pool.query(`
            INSERT INTO transactions (item_id, quantity, transaction_type)
            VALUES ($1, $2, $3)
          `, [newItem.rows[0].item_id, item.quantity, 'RECEIVE']);
          
          categoryCapacity += item.quantity;
        }
        
        await pool.query(`
          UPDATE categories
          SET current_capacity = $1
          WHERE category_id = $2
        `, [categoryCapacity, category.category_id]);
      }
      
      console.log('Predefined items added to categories');
    }

  } catch (err) {
    console.error('Database initialization error:', err.message);
    process.exit(1);
  }
};

module.exports = initDB; 