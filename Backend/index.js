const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
