const repository = require("../repositories/irregularityRepository");
const db = require("../config/dbTest");
const Irregularities = require("../models/irregularity");

beforeAll(async () => await db.connectDb());
afterEach(async () => await db.clearDb());
afterAll(async () => await db.closeDb());

test("createIrregularity will create irregularity", async () => {
  const dateNow = new Date();

  const irregularityData = {
    startedAt: dateNow,
    finishedAt: dateNow,
  };
  const data = await repository.createIrregularity(irregularityData);
  expect(data.startedAt.toISOString()).toBe(dateNow.toISOString());
  expect(data.finishedAt.toISOString()).toBe(dateNow.toISOString());
});

test("listAllIrregularities will return the irregularities", async () => {
  const dateNow = new Date();

  const irregularityData = {
    startedAt: dateNow,
    finishedAt: dateNow,
  };
  await new Irregularities(irregularityData).save();
  await new Irregularities(irregularityData).save();

  const data = await repository.listAllIrregularities();

  expect(data.length).toBe(2);
});

test("setFinishedDateOnTheLastIrregularity will set finishedAt", async () => {
  const dateNow = new Date();

  const irregularityData = {
    startedAt: dateNow,
  };
  const irregularity = await new Irregularities(irregularityData).save();

  expect(irregularity.finishedAt).toBe(undefined);

  const data = await repository.setFinishedDateOnTheLastIrregularity();

  expect(data.finishedAt).not.toBe(undefined);
  expect(data.finishedAt).toBeInstanceOf(Date);
});
