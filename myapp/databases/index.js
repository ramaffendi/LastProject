const mongoose = require("mongoose");
const { dbHost, dbName, dbPass, dbPort, dbUser } = require("../app/config.js");

mongoose.connect(
  `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
);
const db = mongoose.connection;

console.log("database berjalan");

module.exports = db;
