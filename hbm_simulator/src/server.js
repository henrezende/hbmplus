const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const handler = require("./handler");

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "../proto/hbm_simulator.proto")
);
const HbmDefinition = grpc.loadPackageDefinition(protoObject);

const server = new grpc.Server();
server.addService(HbmDefinition.HbmService.service, {
  sendIrregularityAlert: (call, _) => handler.showIrregularityAlert(call),

  startNormalMeasurement: (call, _) => handler.startNormalMeasurement(call),

  startIrregularMeasurement: (call, _) =>
    handler.startIrregularMeasurement(call),

  stopMeasurement: (call, _) => handler.stopMeasurement(call),

  listAllIrregularities: (call, _) => handler.listAllIrregularities(call),

  listAllMeasuresFromTheLast30Days: (call, _) =>
    handler.listAllMeasuresFromTheLast30Days(call),
});

module.exports = server;
