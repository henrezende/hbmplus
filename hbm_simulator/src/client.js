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
  path.resolve(__dirname, "../proto/hbm.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);
const NotesDefinition = grpc.loadPackageDefinition(protoObject);

const client = new NotesDefinition.HbmService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
promisify(client);

module.exports = {
  client: client,
};
