const mongoose = require("mongoose");
const ChaterSchema = require("../schemas/chaterSchema");

// Reply Type
const SubMessageSchema = mongoose.Schema({
  for: { type: String, require: true },
  files: { type: Array },
  type: {
    type: String,
    enum: ["TEXT", "FILES", "VOICE"],
    require: true,
  },
  state: {
    type: String,
    enum: ["REVEIVER", "BOTH", "NONE"],
    default: "BOTH",
    require: true,
  },
  messages: { type: String, require: true },
  seen_at: { type: Date, default: Date.now },
});

// Message Schema
const MessagesSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversations",
  },
  files: { type: Array },
  type: {
    type: String,
    enum: ["TEXT", "FILES", "VOICE"],
    require: true,
  },
  state: {
    type: String,
    enum: ["REVEIVER", "BOTH", "NONE"],
    default: "BOTH",
    require: true,
  },
  reply: {
    type: SubMessageSchema,
    default: null,
  },
  messages: { type: String, require: true },
  seen_at: { type: Date, default: Date.now },
  seenders: { type: [ChaterSchema], default: [] },
  sender: { type: ChaterSchema, require: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Message Model
const MessagesModel = mongoose.model("Messages", MessagesSchema);

module.exports = MessagesModel;
