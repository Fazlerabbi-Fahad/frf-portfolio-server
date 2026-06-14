import { Router } from "express";
import { body } from "express-validator";
import {
  listProjects, getProjectBySlug, createProject, updateProject, deleteProject, toggleProjectPublish,
} from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = Router();
r.get("/", listProjects);
r.get("/:slug", getProjectBySlug);
r.post("/", requireAuth, body("title").notEmpty(), validate, createProject);
r.put("/:id", requireAuth, updateProject);
r.patch("/:id/publish", requireAuth, toggleProjectPublish);
r.delete("/:id", requireAuth, deleteProject);
export default r;
