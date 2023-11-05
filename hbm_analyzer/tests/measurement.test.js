const repository = require("../repositories/measurementRepository");
const db = require("../config/dbTest");
const Measurement = require("../models/measurement");

beforeAll(async () => await db.connectDb());
afterEach(async () => await db.clearDb());
afterAll(async () => await db.closeDb());

test("createMeasurement will create measurement", async () => {
  const measurementData = {
    milivoltExpected: 1.0001234,
    milivoltMeasured: 2.954,
    milisecond: 1546,
    percentualDifference: 59,
    isIrregular: true,
  };
  const data = await repository.createMeasurement(measurementData);

  expect(data.milivoltExpected.toString()).toBe("1.0001234");
  expect(data.milivoltMeasured.toString()).toBe("2.954");
  expect(data.milisecond.toString()).toBe("1546");
  expect(data.percentualDifference.toString()).toBe("59");
  expect(data.isIrregular).toBe(true);
});

test("listAllMeasuresFromTheLast30Days will return the irregularities", async () => {
  const measurementData = {
    milivoltExpected: 1.0001234,
    milivoltMeasured: 2.954,
    milisecond: 1546,
    percentualDifference: 59,
    isIrregular: true,
  };
  await new Measurement(measurementData).save();
  await new Measurement(measurementData).save();

  const data = await repository.listAllMeasuresFromTheLast30Days();

  expect(data.length).toBe(2);
});
