const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
    },
    title: String,
    mobile: String,
    address: String,
    category: String,
    imagePath: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalHiring: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Service = mongoose.model("Service", serviceSchema);

export default Service;
