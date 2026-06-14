import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    coverImage: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: false, index: true },
    readingMinutes: { type: Number, default: 1 },
  },
  { timestamps: true }
);

blogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) this.slug = slugify(this.title, { lower: true, strict: true });
  if (this.content) {
    const words = this.content.trim().split(/\s+/).length;
    this.readingMinutes = Math.max(1, Math.round(words / 200));
  }
  next();
});

blogSchema.index({ title: "text", excerpt: "text", content: "text" });

export const Blog = mongoose.model("Blog", blogSchema);
