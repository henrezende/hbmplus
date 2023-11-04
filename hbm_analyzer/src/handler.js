const grpc = require("@grpc/grpc-js");
const { client } = require("./client");
const measurementRepository = require("../repositories/measurement-repository");
const irregularityRepository = require("../repositories/irregularity-repository");

const IRREGULARITY_LIMIT_TO_SEND_ALERT = 5;
const MEASURE_COUNT_LIMIT = 60;
const PERCENTUAL_DIFF_LIMIT = 20;
let irregularityCount = 0;
let measuresCountSinceLastIrregularity = 0;
let anAlertWasSent = false;

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

function handleSendIrregularityAlert(message) {
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

async function handleIrregularity() {
  irregularityCount++;
  measuresCountSinceLastIrregularity = 0;

  if (
    irregularityCount === IRREGULARITY_LIMIT_TO_SEND_ALERT &&
    !anAlertWasSent
  ) {
    anAlertWasSent = true;
    handleSendIrregularityAlert("BIP");
    await irregularityRepository.createIrregularity({
      startedAt: Date.now(),
    });
  }
}

async function handleMeasure() {
  if (
    measuresCountSinceLastIrregularity >= MEASURE_COUNT_LIMIT &&
    anAlertWasSent
  ) {
    irregularityCount = 0;
    measuresCountSinceLastIrregularity = 0;
    anAlertWasSent = false;
    handleSendIrregularityAlert("BIP BIP BIP");
    await irregularityRepository.setFinishedDateOnTheLastIrregularity();
  } else {
    measuresCountSinceLastIrregularity++;
  }
}

async function analyzeData(call, data) {
  let currentMeasureIsIrregular = false;

  if (irregularityCount > 0) {
    handleMeasure();
  }

  const expectedMilivoltValue = getExpectedMilivoltsValue(
    data.hbmData.milisecond
  );

  const percentualDiff = getPercentualDiffBetweenValues(
    data.hbmData.milivolt,
    expectedMilivoltValue
  );

  if (percentualDiff > PERCENTUAL_DIFF_LIMIT) {
    currentMeasureIsIrregular = true;
    handleIrregularity();
  }

  await measurementRepository.createMeasurement({
    milivoltExpected: expectedMilivoltValue,
    milivoltMeasured: data.hbmData.milivolt,
    milisecond: data.hbmData.milisecond,
    percentualDifference: percentualDiff,
    isIrregular: currentMeasureIsIrregular,
  });

  call.end();
}

async function listAllMeasuresFromTheLast30Days(callback) {
  const response =
    await measurementRepository.listAllMeasuresFromTheLast30Days();
  callback(null, { measures: response });
}

async function listAllIrregularities(callback) {
  const response = await irregularityRepository.listAllIrregularities();
  callback(null, { irregularities: response });
}

module.exports = {
  analyzeData,
  listAllMeasuresFromTheLast30Days,
  listAllIrregularities,
};
