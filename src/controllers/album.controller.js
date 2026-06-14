import { Album } from "../models/Album.js";
import { Photo } from "../models/Photo.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listAlbums = asyncHandler(async (_req, res) => {
  const albums = await Album.find().sort({ travelDate: -1, createdAt: -1 });
  const withCounts = await Promise.all(
    albums.map(async (a) => {
      const photoCount = await Photo.countDocuments({ album: a._id });
      return { ...a.toObject(), photoCount };
    })
  );
  res.json(withCounts);
});

export const getAlbumBySlug = asyncHandler(async (req, res) => {
  const album = await Album.findOne({ slug: req.params.slug });
  if (!album) throw ApiError.notFound("Album not found");
  const photos = await Photo.find({ album: album._id }).sort({ order: 1, createdAt: 1 });
  res.json({ album, photos });
});

export const createAlbum = asyncHandler(async (req, res) => {
  const album = await Album.create(req.body);
  res.status(201).json(album);
});

export const updateAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!album) throw ApiError.notFound("Album not found");
  res.json(album);
});

export const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await Album.findByIdAndDelete(req.params.id);
  if (!album) throw ApiError.notFound("Album not found");
  await Photo.deleteMany({ album: album._id });
  res.json({ ok: true });
});
