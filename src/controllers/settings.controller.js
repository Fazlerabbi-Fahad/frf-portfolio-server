import { Settings } from "../models/Settings.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// the defaults — your current hardcoded hero stats
const DEFAULT_HERO_STATS = [
  { label: "Shipped projects", value: "12", unit: "repos", tone: "cyan" },
  { label: "Core stack", value: "React · .NET · Node", unit: "", tone: "cyan" },
  { label: "Last field note", value: "Bandarban", unit: "22.19°N", tone: "ember" },
  { label: "Available", value: "Remote · GMT+6", unit: "", tone: "ember" },
];

// get-or-create: the singleton springs into existence on first read
async function getOrCreateSettings() {
  let settings = await Settings.findOne({ key: "site" });
  if (!settings) {
    settings = await Settings.create({ key: "site", heroStats: DEFAULT_HERO_STATS });
  }
  return settings;
}

// PUBLIC — the home page reads this
export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ heroStats: settings.heroStats });
});

// PROTECTED — the admin updates this
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  if (Array.isArray(req.body.heroStats)) {
    settings.heroStats = req.body.heroStats;
  }
  await settings.save();
  res.json({ heroStats: settings.heroStats });
});