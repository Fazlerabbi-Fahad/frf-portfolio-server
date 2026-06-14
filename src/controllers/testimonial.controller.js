import { Testimonial } from "../models/Testimonial.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listTestimonials = asyncHandler(async (req, res) => {
  const filter = req.query.all ? {} : { published: true };
  const items = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(items);
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const t = await Testimonial.create(req.body);
  res.status(201).json(t);
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!t) throw ApiError.notFound("Testimonial not found");
  res.json(t);
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  const t = await Testimonial.findByIdAndDelete(req.params.id);
  if (!t) throw ApiError.notFound("Testimonial not found");
  res.json({ ok: true });
});
