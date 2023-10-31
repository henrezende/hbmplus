const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "../proto/hbm.proto")
);
const NotesDefinition = grpc.loadPackageDefinition(protoObject);

function SendHbmData(call, callback) {
  call.on("data", async (data) => {
    console.log("SendHbmData: ", data);
  });
  call.on("end", async () => {
    console.log("end");
  });
}

const server = new grpc.Server();
server.addService(NotesDefinition.HbmService.service, { SendHbmData });

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Listening");
  }
);
