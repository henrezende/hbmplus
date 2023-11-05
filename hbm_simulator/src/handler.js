const { client } = require("./client");

let measurementInterval = null;
let milisecond = 0;
const MEASURE_MILISECOND_RATE = 100;

function generateData(willGenerateIrregular) {
  let randomLimit = 94;

  let milivolt =
    -0.06366 +
    0.12613 * Math.cos((Math.PI * milisecond) / 500) +
    0.12258 * Math.cos((Math.PI * milisecond) / 250) +
    0.01593 * Math.sin((Math.PI * milisecond) / 500) +
    0.03147 * Math.sin((Math.PI * milisecond) / 250);

  if (willGenerateIrregular) {
    const randomInteger = Math.floor(Math.random() * 100);

    if (process.env.NODE_ENV) {
      randomLimit = 0;
    }

    if (randomInteger >= randomLimit) {
      milivolt = milivolt * 1.3;
    }
  }

  const hbmData = { milisecond, milivolt };
  milisecond += MEASURE_MILISECOND_RATE;
  return hbmData;
}

function startNormalMeasurement(call) {
  milisecond = 0;

  if (process.env.NODE_ENV !== "test") {
    measurementInterval = setInterval(() => {
      client.sendHbmData().write({ hbmData: generateData(false) });
    }, MEASURE_MILISECOND_RATE);

    call.end();
  } else {
    return generateData(false);
  }
}

function startIrregularMeasurement(call) {
  milisecond = 0;

  if (process.env.NODE_ENV !== "test") {
    measurementInterval = setInterval(() => {
      client.sendHbmData().write({ hbmData: generateData(true) });
    }, MEASURE_MILISECOND_RATE);

    call.end();
  } else {
    return generateData(true);
  }
}

function stopMeasurement(call) {
  clearInterval(measurementInterval);
  call.end();
}

function showIrregularityAlert(call) {
  console.log(call.request.message);
}

function listAllIrregularities(call) {
  client.listAllIrregularities({}, (err, response) => {
    if (err) {
      console.log("error: ", err);
    }
    console.log("response: ", response);
  });
  call.end();
}

function listAllMeasuresFromTheLast30Days(call) {
  client.listAllMeasuresFromTheLast30Days({}, (err, response) => {
    if (err) {
      console.log("error: ", err);
    }
    console.log("response: ", response);
  });
  call.end();
}

module.exports = {
  startNormalMeasurement,
  startIrregularMeasurement,
  stopMeasurement,
  showIrregularityAlert,
  listAllIrregularities,
  listAllMeasuresFromTheLast30Days,
};
