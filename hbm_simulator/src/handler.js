const { client } = require("./client");

let measurementInterval = null;

function startNormalMeasurement(call, callback) {
  let x = 0;
  const step = 1000; // Update every x millisecond

  function generateData() {
    const y =
      -0.06366 +
      0.12613 * Math.cos((Math.PI * x) / 500) +
      0.12258 * Math.cos((Math.PI * x) / 250) +
      0.01593 * Math.sin((Math.PI * x) / 500) +
      0.03147 * Math.sin((Math.PI * x) / 250);
    const data = { x, y };
    x += step;
    return data;
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

module.exports = {
  startNormalMeasurement,
  stopMeasurement,
};
