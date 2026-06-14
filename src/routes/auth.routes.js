import { Router } from "express";
import { body } from "express-validator";
import { login, refresh, logout, me } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";

const r = Router();
r.post(
  "/login",
  authLimiter,
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  validate,
  login
);
r.post("/refresh", refresh);
r.post("/logout", logout);
r.get("/me", requireAuth, me);
export default r;
