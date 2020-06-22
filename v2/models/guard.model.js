const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guardSchema = new Schema(
  {
    name: String,
    mobile: {
      type: String,
      unique: true,
    },
    sector: String,
    block: String,
  },
  {
    timestamps: true,
  }
);

export const Guard = mongoose.model("Guard", guardSchema);

export default Guard;
