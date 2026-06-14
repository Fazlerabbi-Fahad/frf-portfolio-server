import { Photo } from "../models/Photo.js";
import { Album } from "../models/Album.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const addPhoto = asyncHandler(async (req, res) => {
  const album = await Album.findById(req.body.album);
  if (!album) throw ApiError.badRequest("Album does not exist");
  const photo = await Photo.create(req.body);
  res.status(201).json(photo);
});

export const deletePhoto = asyncHandler(async (req, res) => {
  const photo = await Photo.findByIdAndDelete(req.params.id);
  if (!photo) throw ApiError.notFound("Photo not found");
  res.json({ ok: true });
});

export const listPhotos = asyncHandler(async (req, res) => {
  const filter = req.query.album ? { album: req.query.album } : {};
  const photos = await Photo.find(filter).sort({ order: 1, createdAt: 1 });
  res.json(photos);
});
