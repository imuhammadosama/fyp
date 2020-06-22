const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const driverSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
    },
    name: String,
    mobile: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
