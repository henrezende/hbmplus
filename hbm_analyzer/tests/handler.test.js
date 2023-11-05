const handler = require("../src/handler");

test("getExpectedMilivoltsValue will generate correct value", () => {
  let milivolt = handler.getExpectedMilivoltsValue(0);
  expect(milivolt).toBe(0.18505);

  milivolt = handler.getExpectedMilivoltsValue(300);
  expect(milivolt).toBe(-0.2051528882560555);

  milivolt = handler.getExpectedMilivoltsValue(5326347);
  expect(milivolt).toBe(-0.1945873109231366);
});

test("getPercentualDiffBetweenValues will return correct value", () => {
  const value = handler.getPercentualDiffBetweenValues(100, 150);
  expect(value).toBe(33);
});
