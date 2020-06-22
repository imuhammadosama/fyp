const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hiredServiceSchema = new Schema(
  {
    memberID: {
      type: Schema.Types.ObjectId,
    },
    serviceID: {
      type: Schema.Types.ObjectId,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isAcceptanceStatusUpdated: {
      type: Boolean,
      default: false,
    },
    rating: Number,
  },
  {
    timestamps: true,
  }
);

export const HiredService = mongoose.model("HiredService", hiredServiceSchema);

export default HiredService;
