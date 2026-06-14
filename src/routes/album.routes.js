import { Router } from "express";
import { body } from "express-validator";
import {
  listAlbums, getAlbumBySlug, createAlbum, updateAlbum, deleteAlbum,
} from "../controllers/album.controller.js";
import { addPhoto, deletePhoto, listPhotos } from "../controllers/photo.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const r = Router();
r.get("/", listAlbums);
r.get("/photos", listPhotos);
r.get("/:slug", getAlbumBySlug);
r.post("/", requireAuth, body("name").notEmpty(), validate, createAlbum);
r.put("/:id", requireAuth, updateAlbum);
r.delete("/:id", requireAuth, deleteAlbum);
r.post("/photos", requireAuth, body("album").notEmpty(), body("url").notEmpty(), validate, addPhoto);
r.delete("/photos/:id", requireAuth, deletePhoto);
export default r;
