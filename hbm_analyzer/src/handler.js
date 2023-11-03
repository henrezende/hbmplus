const grpc = require("@grpc/grpc-js");
const { client } = require("./client");

let irregularityCountInTheLast60Measures = 0;
let measuresCount = 0;

function getExpectedMilivoltsValue(milisecond) {
  const milivolt =
    -0.06366 +
    0.12613 * Math.cos((Math.PI * milisecond) / 500) +
    0.12258 * Math.cos((Math.PI * milisecond) / 250) +
    0.01593 * Math.sin((Math.PI * milisecond) / 500) +
    0.03147 * Math.sin((Math.PI * milisecond) / 250);

  return milivolt;
}

function getPercentualDiffBetweenValues(currentValue, expectedValue) {
  return Math.round(
    Math.abs(((currentValue - expectedValue) / expectedValue) * 100)
  );
}

function handleIrregularity() {
  irregularityCountInTheLast60Measures++;

  if (irregularityCountInTheLast60Measures === 5) {
    sendIrregularityAlert("BIP");
  }
}

function sendIrregularityAlert(message) {
  let metadata = new grpc.Metadata();
  metadata.add("message", message);
  client.sendIrregularityAlert(
    { message: message },
    metadata,
    (err, response) => {
      if (err) {
        console.log(err);
      }
      console.log(response);
    }
  );
}

function handleMeasureCount() {
  if (measuresCount >= 60) {
    measuresCount = 0;
    irregularityCountInTheLast60Measures = 0;
    sendIrregularityAlert("BIP BIP BIP");
  } else {
    measuresCount++;
  }
}

function analyzeData(call, data) {
  console.log(
    "irregularityCountInTheLast60Measures: ",
    irregularityCountInTheLast60Measures
  );
  console.log("measuresCount: ", measuresCount);

  if (irregularityCountInTheLast60Measures > 0) {
    handleMeasureCount();
  }

  const expectedMilivoltValue = getExpectedMilivoltsValue(
    data.hbmData.milisecond
  );

  const percentualDiff = getPercentualDiffBetweenValues(
    data.hbmData.milivolt,
    expectedMilivoltValue
  );

  if (percentualDiff > 20) {
    handleIrregularity();
  }

  call.end();
}

module.exports = {
  analyzeData,
};
