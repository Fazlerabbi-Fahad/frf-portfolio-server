import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.get("/", getSettings);                  // public
r.patch("/", requireAuth, updateSettings); // protected
export default r;