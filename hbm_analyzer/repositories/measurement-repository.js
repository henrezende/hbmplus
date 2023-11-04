const mongoose = require("mongoose");
const Measurements = require("../models/measurement");

exports.listAllMeasuresFromTheLast30Days = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const res = await Measurements.find({
    createdAt: { $gte: thirtyDaysAgo },
  })
    .sort({ createdAt: -1 })
    .exec();
  return res;
};

exports.createMeasurement = async (data) => {
  const measurement = new Measurements(data);
  await measurement.save();
};
