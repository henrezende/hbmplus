const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer = null;

module.exports.connectDb = async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

module.exports.closeDb = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

module.exports.clearDb = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
