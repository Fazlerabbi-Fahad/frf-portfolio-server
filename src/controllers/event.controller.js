import { Event } from "../models/Event.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recordEvent = asyncHandler(async (req, res) => {
  const { type, target, meta } = req.body;
  const allowed = ["share", "click", "download", "view"];
  if (!allowed.includes(type)) {
    return res.status(204).end(); 
  }
  await Event.create({ type, target: target || "", meta: meta || "" });
  res.status(201).json({ ok: true });
});

export const eventStats = asyncHandler(async (_req, res) => {
  const byType = await Event.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent = await Event.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  const topTargets = await Event.aggregate([
    { $match: { type: "click", target: { $ne: "" } } },
    { $group: { _id: "$target", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const toMap = (arr) => Object.fromEntries(arr.map((x) => [x._id, x.count]));

  res.json({
    total: toMap(byType),
    last30: toMap(recent),
    topTargets, // already an array, frontend maps it
  });
});