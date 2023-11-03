const { client } = require("./client");

let measurementInterval = null;

function startNormalMeasurement(call, callback) {
  let milisecond = 0;
  const step = 100; // Update every x millisecond

  function generateData() {
    let milivolt =
      -0.06366 +
      0.12613 * Math.cos((Math.PI * milisecond) / 500) +
      0.12258 * Math.cos((Math.PI * milisecond) / 250) +
      0.01593 * Math.sin((Math.PI * milisecond) / 500) +
      0.03147 * Math.sin((Math.PI * milisecond) / 250);

    //generate random irregular values
    const randomInteger = Math.floor(Math.random() * 10);
    if (randomInteger > 8) {
      milivolt = milivolt * 1.3;
    }
    //

    const hbmData = { milisecond, milivolt };
    milisecond += step;
    return hbmData;
  }

  measurementInterval = setInterval(() => {
    client.sendHbmData().write({ hbmData: generateData() });
  }, step);

  call.end();
}

function stopMeasurement(call) {
  clearInterval(measurementInterval);
  call.end();
}

function sendIrregularityAlert(call) {
  console.log("VAAAAAAAI");
  console.log(call.request);
}

module.exports = {
  startNormalMeasurement,
  stopMeasurement,
  sendIrregularityAlert,
};
