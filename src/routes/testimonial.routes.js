import { Router } from "express";
import { body } from "express-validator";
import {
  listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from "../controllers/testimonial.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = Router();
r.get("/", listTestimonials);
r.post("/", requireAuth, body("quote").notEmpty(), body("author").notEmpty(), validate, createTestimonial);
r.put("/:id", requireAuth, updateTestimonial);
r.delete("/:id", requireAuth, deleteTestimonial);
export default r;
