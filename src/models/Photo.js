import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    album: { type: mongoose.Schema.Types.ObjectId, ref: "Album", required: true, index: true },
    url: { type: String, required: true },
    caption: { type: String, default: "" },
    width: { type: Number },
    height: { type: Number },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Photo = mongoose.model("Photo", photoSchema);
