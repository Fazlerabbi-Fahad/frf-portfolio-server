import mongoose from "mongoose";
import slugify from "slugify";

const albumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    coverImage: { type: String, default: "" },
    story: { type: String, default: "" },
    location: { type: String, default: "" },
    travelDate: { type: Date },
  },
  { timestamps: true }
);

albumSchema.pre("validate", function (next) {
  if (this.name && !this.slug) this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

export const Album = mongoose.model("Album", albumSchema);
