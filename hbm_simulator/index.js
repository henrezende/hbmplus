const { clientCall } = require("./src/client");

async function run() {
  let x = 0;
  const step = 1; // Update every 1 millisecond

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

  setInterval(() => {
    clientCall.write({ hbmData: generateData() });
  }, step);
}

run().catch(console.error);
