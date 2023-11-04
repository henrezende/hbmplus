const mongoose = require("mongoose");
const Irregularities = require("../models/irregularity");

exports.listAllIrregularities = async () => {
  const res = await Irregularities.find({}).sort({ startedAt: -1 }).exec();
  return res;
};

exports.createIrregularity = async (data) => {
  const irregularity = new Irregularities(data);
  await irregularity.save();
};

exports.setFinishedDateOnTheLastIrregularity = async () => {
  await Irregularities.findOneAndUpdate(
    {},
    { $set: { finishedAt: new Date() } },
    { sort: { createdAt: -1 }, new: true }
  ).exec();
};
