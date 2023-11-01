const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const handler = require("./handler");

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "../proto/hbm.proto")
);
const NotesDefinition = grpc.loadPackageDefinition(protoObject);

const server = new grpc.Server();
server.addService(NotesDefinition.HbmService.service, {
  sendHbmData: (call, _) => {
    call.on("data", async (data) => {
      console.log("Sending HBM Data: ", data);
    });
    call.on("status", async () => {
      console.log("Ended HBM Data");
    });
  },

  startNormalMeasurement: (call, callback) =>
    handler.startNormalMeasurement(call, callback),

  stopMeasurement: (call, _) => handler.stopMeasurement(call),
});

module.exports = server;
