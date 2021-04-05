const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  img: String,
  admin: {
    type: String,
    // default: "off",
  },
  limit: {
    type: String,
    // default: "off",
  },
  block: {
    type: String,
    // default: "off",
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = model("User", userSchema);
