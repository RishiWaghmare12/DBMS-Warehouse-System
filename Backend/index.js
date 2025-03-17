const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const initDB = require("./db/init");
const { pool } = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();
    await initDB();
    
    app.get('/', (req, res) => {
      res.json({ message: 'Warehouse Management API is running' });
    });

    // Health check route to verify database connection
    app.get('/health', async (req, res) => {
      try {
        const result = await pool.query('SELECT NOW()');
        res.json({
          status: 'healthy',
          dbConnection: 'connected',
          timestamp: result.rows[0].now
        });
      } catch (error) {
        res.status(500).json({
          status: 'unhealthy',
          dbConnection: 'failed',
          error: error.message
        });
      }
    });

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server error:", err.message);
    process.exit(1);
  }
};

startServer();
