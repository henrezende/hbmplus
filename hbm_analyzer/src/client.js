const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "../proto/hbm_analyzer.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const HbmDefinition = grpc.loadPackageDefinition(protoObject);

const client = new HbmDefinition.HbmService(
  "hbm-simulator:50051",
  grpc.credentials.createInsecure()
);

module.exports = {
  client: client,
};
