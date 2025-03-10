import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
// This middleware runs before saving a document
// Ensures that every time a new Channel is created or modified and saved, the updatedAt field is refreshed/Updated.
channelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});
// This middleware runs before updating a document using 
// Ensures that whenever a document is updated via .findOneAndUpdate(), the updatedAt field reflects the latest modification time.
channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel = mongoose.model("Channels", channelSchema);
export default Channel;