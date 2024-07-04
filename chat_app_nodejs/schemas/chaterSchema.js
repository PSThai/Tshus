const mongoose = require("mongoose");

// Chater Type
const ChaterSchema = mongoose.Schema({
  nickname: { type: String, required: true, maxlength: 255 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: { type: String, default: "" },
});

// Tắt tự động render _id
ChaterSchema.set("autoIndex", false);

// Tắt tự động render _id trong các phương thức find, findOne, findById, và các phương thức khác
ChaterSchema.set("toObject", {
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = ChaterSchema;
