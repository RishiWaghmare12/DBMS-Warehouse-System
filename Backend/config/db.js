const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("PostgreSQL connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, pool };
