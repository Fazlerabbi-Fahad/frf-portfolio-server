import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // a fixed key so there's only ever ONE settings document
    key: { type: String, default: "site", unique: true },

    // the four hero stats — each has a label, value, optional unit, and tone
    heroStats: {
      type: [
        {
          label: { type: String, default: "" },
          value: { type: String, default: "" },
          unit: { type: String, default: "" },
          tone: { type: String, enum: ["cyan", "ember"], default: "cyan" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);