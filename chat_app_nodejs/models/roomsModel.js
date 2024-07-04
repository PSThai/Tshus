const mongoose = require("mongoose");

// Rooms Schema
const RoomsSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversations",
      unique: true,
      require: true
    },
    name: { type: String, required: true, maxlength: 255, index: 'text' },
    image: { type: String, default: "" },
    member_count: { type: Number, require: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  }
);

// Rooms Model
const RoomsModel = mongoose.model("Rooms", RoomsSchema);

module.exports = RoomsModel;
