const mongoose = require("mongoose");

const uri = "mongodb://mongo:27017/hbmdb";

const connectDb = () => {
  mongoose.connect(uri);
};

module.exports = connectDb;
