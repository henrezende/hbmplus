const mongoose = require("mongoose");
const Irregularities = require("../models/irregularity");

exports.listAllIrregularities = async () => {
  const res = await Irregularities.find({}).sort({ startedAt: -1 }).exec();
  return res;
};

exports.createIrregularity = async (data) => {
  const irregularity = new Irregularities(data);
  return await irregularity.save();
};

exports.setFinishedDateOnTheLastIrregularity = async () => {
  return await Irregularities.findOneAndUpdate(
    {},
    { $set: { finishedAt: new Date() } },
    { sort: { startedAt: -1 }, new: true }
  ).exec();
};
