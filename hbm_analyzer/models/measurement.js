const mongoose = require("mongoose");
const { Schema } = mongoose;

const measurementSchema = new Schema(
  {
    milivoltExpected: Schema.Types.Decimal128,
    milivoltMeasured: Schema.Types.Decimal128,
    milisecond: Schema.Types.Decimal128,
    percentualDifference: Schema.Types.Decimal128,
    isIrregular: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Measurements", measurementSchema);
