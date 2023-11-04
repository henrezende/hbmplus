const mongoose = require("mongoose");
const { Schema } = mongoose;

const irregularitySchema = new Schema({
  startedAt: Date,
  finishedAt: Date,
});

module.exports = mongoose.model("Irregularity", irregularitySchema);
