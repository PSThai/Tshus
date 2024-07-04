const { mongoose, model } = require("mongoose");

// Users Schema
const UsersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    nickname: { type: String, required: true, maxlength: 255, index: 'text' },
    active: { type: Boolean, default: true },
    phone: { type: String, required: true, minlength: 10, maxlength: 10 },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: "OTHER",
    },
    roles: { type: [String], enum: ["USER", "ADMIN"], default: ["USER"] },
    avatar: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }
);

// User Model
const UsersModel = model("User", UsersSchema);

module.exports = UsersModel;
