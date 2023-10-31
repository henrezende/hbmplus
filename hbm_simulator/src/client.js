const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

function promisify(client) {
  for (let method in client) {
    client[`${method}Async`] = (parameters) => {
      return new Promise((resolve, reject) => {
        client[method](parameters, (err, response) => {
          if (err) reject(err);
          resolve(response);
        });
      });
    };
  }
}

const protoObject = protoLoader.loadSync(
  path.resolve(__dirname, "../proto/hbm.proto")
);
const NotesDefinition = grpc.loadPackageDefinition(protoObject);

const client = new NotesDefinition.HbmService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
promisify(client);

const clientCall = client.sendHbmData();
clientCall.on("data", function (response) {
  console.log("client call: ", response);
});

clientCall.on("error", function (error) {
  console.log(error.code, " -> ", error.details);
});

clientCall.on("end", function () {
  console.log(`Closed`);
});

module.exports = {
  clientCall: clientCall,
};
