const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const handler = require("./handler");

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "../proto/hbm.proto")
);
const HbmDefinition = grpc.loadPackageDefinition(protoObject);

const server = new grpc.Server();

server.addService(HbmDefinition.HbmService.service, {
  sendHbmData: (call, _) => {
    call.on("data", async (data) => {
      handler.analyzeData(call, data);
    });
    call.on("end", async () => {
      console.log("Ended HBM Data");
    });
  },
});

module.exports = server;
