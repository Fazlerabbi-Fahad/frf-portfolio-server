import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    year: { type: String, default: "" },
    role: { type: String, default: "" },
    blurb: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    stack: { type: [String], default: [] },
    challenge: { type: String, default: "" },
    solution: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    repoUrl: { type: String, default: "" },
    accent: { type: String, enum: ["cyan", "ember"], default: "cyan" },
    metric: { type: String, default: "" },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.pre("validate", function (next) {
  if (this.title && !this.slug) this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

export const Project = mongoose.model("Project", projectSchema);
