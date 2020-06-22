const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workerSchema = new Schema(
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

export const Worker = mongoose.model("Worker", workerSchema);

export default Worker;
