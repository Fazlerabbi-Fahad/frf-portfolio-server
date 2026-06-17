import { Router } from "express";
import { recordEvent, eventStats } from "../controllers/event.controller.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();

r.post("/", recordEvent);             
r.get("/stats", requireAuth, eventStats); 

export default r;