const { client } = require("./client");

let measurementInterval = null;
let milisecond = 0;
const MEASURE_MILISECOND_RATE = 100;

function generateData(willGenerateIrregular) {
  let milivolt =
    -0.06366 +
    0.12613 * Math.cos((Math.PI * milisecond) / 500) +
    0.12258 * Math.cos((Math.PI * milisecond) / 250) +
    0.01593 * Math.sin((Math.PI * milisecond) / 500) +
    0.03147 * Math.sin((Math.PI * milisecond) / 250);

  if (willGenerateIrregular) {
    const randomInteger = Math.floor(Math.random() * 100);
    if (randomInteger > 95) {
      milivolt = milivolt * 1.3;
    }
  }

  const hbmData = { milisecond, milivolt };
  milisecond += MEASURE_MILISECOND_RATE;
  return hbmData;
}

function startNormalMeasurement(call) {
  milisecond = 0;

  measurementInterval = setInterval(() => {
    client.sendHbmData().write({ hbmData: generateData(false) });
  }, MEASURE_MILISECOND_RATE);

  call.end();
}

function startIrregularMeasurement(call) {
  milisecond = 0;

  measurementInterval = setInterval(() => {
    client.sendHbmData().write({ hbmData: generateData(true) });
  }, MEASURE_MILISECOND_RATE);

  call.end();
}

function stopMeasurement(call) {
  clearInterval(measurementInterval);
  call.end();
}

function sendIrregularityAlert(call) {
  console.log(call.request.message);
}

module.exports = {
  startNormalMeasurement,
  startIrregularMeasurement,
  stopMeasurement,
  sendIrregularityAlert,
};
