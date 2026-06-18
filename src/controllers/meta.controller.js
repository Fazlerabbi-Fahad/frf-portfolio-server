import { Blog } from "../models/Blog.js";
import { Album } from "../models/Album.js";
import { Photo } from "../models/Photo.js";
import { Project } from "../models/Project.js";
import { Testimonial } from "../models/Testimonial.js";
import { Category } from "../models/Category.js";
import { Tag } from "../models/Tag.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";
import { sendContactEmail } from "../services/email.service.js";

export const dashboardStats = asyncHandler(async (_req, res) => {
  const [blogs, albums, photos, published, projects, testimonials] =
    await Promise.all([
      Blog.countDocuments(),
      Album.countDocuments(),
      Photo.countDocuments(),
      Blog.countDocuments({ published: true }),
      Project.countDocuments(),
      Testimonial.countDocuments(),
    ]);
  const recent = await Blog.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .select("title updatedAt published");
  res.json({
    blogs,
    albums,
    photos,
    published,
    projects,
    testimonials,
    recent,
  });
});

export const listCategories = asyncHandler(async (_req, res) => {
  res.json(await Category.find().sort({ name: 1 }));
});
export const createCategory = asyncHandler(async (req, res) => {
  res.status(201).json(await Category.create(req.body));
});
export const listTags = asyncHandler(async (_req, res) => {
  res.json(await Tag.find().sort({ name: 1 }));
});
export const createTag = asyncHandler(async (req, res) => {
  res.status(201).json(await Tag.create(req.body));
});

export const getSiteAuthor = asyncHandler(async (_req, res) => {
  const user = await User.findOne({ role: "admin" }).select("name avatar bio");
  if (!user) return res.json(null);
  res.json({ name: user.name, avatar: user.avatar, bio: user.bio });
});

export const submitContact = asyncHandler(async (req, res) => {
  if (req.body.website) return res.json({ ok: true });
  const { name, email, message } = req.body;
  try {
    await sendContactEmail({ name, email, message });
  } catch (err) {
    return res
      .status(502)
      .json({ error: "Could not send your message. Please try again." });
  }
  res.json({ ok: true, message: "Thanks — I'll be in touch." });
});
