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
  sendIrregularityAlert: (call, _) => handler.sendIrregularityAlert(call),

  startNormalMeasurement: (call, _) => handler.startNormalMeasurement(call),

  startIrregularMeasurement: (call, _) =>
    handler.startIrregularMeasurement(call),

  stopMeasurement: (call, _) => handler.stopMeasurement(call),
});

module.exports = server;
