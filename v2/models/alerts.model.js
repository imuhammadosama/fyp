const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alertSchema = new Schema(
  {
    title: String,
    description: String,
    memberID: Schema.Types.ObjectId,
    guardID: Schema.Types.ObjectId,
    status: {
      type: String,
      default: "Unresolved",
    },
  },
  {
    timestamps: true,
  }
);

export const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
