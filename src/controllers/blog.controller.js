import { Blog } from "../models/Blog.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listBlogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 9);
  const { q, category, tag, all } = req.query;

  const filter = {};
  if (!all) filter.published = true;
  if (category) filter.category = category;
  if (tag) filter.tags = tag;
  if (q) filter.$text = { $search: q };

  const [items, total] = await Promise.all([
    Blog.find(filter)
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Blog.countDocuments(filter),
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug })
    .populate("category", "name slug")
    .populate("tags", "name slug")
    .populate("author", "name avatar bio");
  if (!blog) throw ApiError.notFound("Blog not found");
  res.json(blog);
});

export const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create({ ...req.body, author: req.user.id });
  res.status(201).json(blog);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!blog) throw ApiError.notFound("Blog not found");
  res.json(blog);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) throw ApiError.notFound("Blog not found");
  res.json({ ok: true });
});

export const togglePublish = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw ApiError.notFound("Blog not found");
  blog.published = !blog.published;
  await blog.save();
  res.json(blog);
});
