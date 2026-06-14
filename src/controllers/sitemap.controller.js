import { Blog } from "../models/Blog.js";
import { Album } from "../models/Album.js";
import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const SITE = process.env.SITE_URL || "https://fazlerabbifahad.dev";
const staticPaths = ["", "/projects", "/blog", "/gallery", "/about", "/contact"];

export const sitemap = asyncHandler(async (_req, res) => {
  const [blogs, albums, projects] = await Promise.all([
    Blog.find({ published: true }).select("slug updatedAt"),
    Album.find().select("slug updatedAt"),
    Project.find({ published: true }).select("slug updatedAt"),
  ]);

  const urls = [
    ...staticPaths.map((p) => ({ loc: `${SITE}${p}` })),
    ...projects.map((p) => ({ loc: `${SITE}/projects/${p.slug}`, lastmod: p.updatedAt })),
    ...blogs.map((b) => ({ loc: `${SITE}/blog/${b.slug}`, lastmod: b.updatedAt })),
    ...albums.map((a) => ({ loc: `${SITE}/gallery/${a.slug}`, lastmod: a.updatedAt })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ""}</url>`
  )
  .join("\n")}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});
