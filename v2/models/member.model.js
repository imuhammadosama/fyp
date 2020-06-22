const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
    },
    name: String,
    membershipNumber: {
      type: String,
      unique: true,
    },
    mobile: {
      type: String,
      unique: true,
    },
    houseNumber: String,
    sector: String,
    block: String,
    coords: Object,
    location: Object,
    notificationToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

memberSchema.index({ location: "2dsphere" });

export const Member = mongoose.model("Member", memberSchema);

export default Member;
