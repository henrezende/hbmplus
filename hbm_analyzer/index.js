const grpc = require("@grpc/grpc-js");
const server = require("./src/server");
const connectDb = require("./config/db");

async function run() {
  connectDb();

  server.bindAsync(
    "0.0.0.0:50052",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("Analyzer started");
    }
  );
}

run().catch(console.error);
