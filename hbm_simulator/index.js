const grpc = require("@grpc/grpc-js");
const { client } = require("./src/client");
const server = require("./src/server");

async function run() {
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("Simulator started");
    }
  );
}

run().catch(console.error);
