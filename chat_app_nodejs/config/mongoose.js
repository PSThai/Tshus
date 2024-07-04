const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Kết nối MongoDB
const uri = process.env.ATLAS_URI;

// Kết nối MongoDB
const DB_NAME = process.env.DB_NAME;

const connectDB = () => {
  // Connection to mongoDB
  mongoose
    .connect(uri, { dbName: DB_NAME })
    .then(() => console.log("MongoDB connection established successfully"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

module.exports = connectDB;
