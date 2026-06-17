import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["share", "click", "download", "view"],
      index: true,
    },
    target: { type: String, default: "" },
    meta: { type: String, default: "" },
  },
  { timestamps: true }
);

eventSchema.index({ type: 1, createdAt: -1 });

export const Event = mongoose.model("Event", eventSchema);