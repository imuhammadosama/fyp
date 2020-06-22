const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rideSchema = new Schema(
  {
    driverID: {
      type: Schema.Types.ObjectId,
    },
    route: Array,
    startPosition: Object,
    isActive: Boolean,
    notifiedMembers: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
