import { Router } from "express";
import { body } from "express-validator";
import {
  listBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, togglePublish,
} from "../controllers/blog.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = Router();
r.get("/", listBlogs);
r.get("/:slug", getBlogBySlug);
r.post("/", requireAuth, body("title").notEmpty(), body("content").notEmpty(), validate, createBlog);
r.put("/:id", requireAuth, updateBlog);
r.patch("/:id/publish", requireAuth, togglePublish);
r.delete("/:id", requireAuth, deleteBlog);
export default r;
