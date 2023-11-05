const handler = require("../src/handler");

test("startNormalMeasurement will generate correct hbm data", () => {
  const data = handler.startNormalMeasurement();
  expect(data.milisecond).toBe(0);
  expect(data.milivolt).toBe(0.18505);
});

test("startIrregularMeasurement will generate incorrect hbm data", () => {
  const data = handler.startIrregularMeasurement();
  expect(data.milisecond).toBe(0);
  expect(data.milivolt).toBeGreaterThan(0.18505);
});

test("showIrregularityAlert will show the message sent", () => {
  const logSpy = jest.spyOn(console, "log");
  const call = {
    request: { message: "test message" },
  };
  handler.showIrregularityAlert(call);
  expect(logSpy).toHaveBeenCalledWith("test message");
});
