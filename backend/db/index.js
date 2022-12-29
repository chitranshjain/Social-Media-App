const mongoose = require("mongoose");

let db;

const connectDB = (callback) => {
  mongoose
    .connect(process.env.MONGODB)
    .then((_db) => {
      db = _db;
      return "Connected to MongoDB";
    })
    .then((message) => {
      console.log(message);
      callback();
    })
    .catch((error) => {
      console.log(
        `Error while connecting to the database, ERROR : ${error.message}`
      );
    });
};

module.exports = { db, connectDB };
