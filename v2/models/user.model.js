const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: String,
    password: String,
    role: String, // Admin, Driver, Member, Guard
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("NewUser", userSchema);

export default User;
