const dotenv = require("dotenv");
const path = require("path");

// Mengambil konfigurasi dari file .env
dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbPass: process.env.DB_PASS,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  secretKey: process.env.SECRET_KEY,
};
