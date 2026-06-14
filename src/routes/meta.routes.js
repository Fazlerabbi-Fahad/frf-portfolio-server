import { Router } from "express";
import { body } from "express-validator";
import {
  dashboardStats, listCategories, createCategory, listTags, createTag, submitContact,
} from "../controllers/meta.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = Router();
r.get("/stats", requireAuth, dashboardStats);
r.get("/categories", listCategories);
r.post("/categories", requireAuth, body("name").notEmpty(), validate, createCategory);
r.get("/tags", listTags);
r.post("/tags", requireAuth, body("name").notEmpty(), validate, createTag);
r.post(
  "/contact",
  body("name").notEmpty(),
  body("email").isEmail(),
  body("message").isLength({ min: 10 }),
  validate,
  submitContact
);
export default r;
