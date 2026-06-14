import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { logger } from "./logger.js";
import { User } from "../models/User.js";
import { Category } from "../models/Category.js";
import { Tag } from "../models/Tag.js";
import { Blog } from "../models/Blog.js";
import { Album } from "../models/Album.js";
import { Photo } from "../models/Photo.js";
import { Project } from "../models/Project.js";
import { Testimonial } from "../models/Testimonial.js";

async function seed() {
  await connectDB(env.mongoUri);

  if (!(await User.findOne({ email: env.admin.email }))) {
    await User.create({ email: env.admin.email, password: env.admin.password, name: "Fahad" });
    logger.info("Admin user created");
  }

  const eng = await Category.findOneAndUpdate(
    { name: "Engineering" }, { name: "Engineering" }, { upsert: true, new: true }
  );
  const tagArch = await Tag.findOneAndUpdate(
    { name: "Architecture" }, { name: "Architecture" }, { upsert: true, new: true }
  );

  if ((await Blog.countDocuments()) === 0) {
    await Blog.create({
      title: "Breaking the build-but-never-ship loop",
      excerpt: "Why finishing is a skill, and how I'm building it.",
      content: "The hardest part of any project is the last ten percent. ".repeat(40),
      category: eng._id,
      tags: [tagArch._id],
      published: true,
    });
    logger.info("Sample blog created");
  }

  if ((await Album.countDocuments()) === 0) {
    const album = await Album.create({
      name: "Bandarban",
      story: "Hills and low cloud in the southeast.",
      location: "Bandarban, Bangladesh",
      travelDate: new Date("2024-12-20"),
      coverImage: "https://picsum.photos/seed/bandarban/1200/800",
    });
    await Photo.insertMany([
      { album: album._id, url: "https://picsum.photos/seed/b1/900/1200", caption: "Morning ridge", order: 1 },
      { album: album._id, url: "https://picsum.photos/seed/b2/1200/800", caption: "Valley road", order: 2 },
    ]);
    logger.info("Sample album + photos created");
  }

  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany([
      {
        title: "HRMS Platform",
        year: "2025",
        role: "Architect & full-stack engineer",
        blurb: "Enterprise human-resources system with payroll, leave and JWT-secured access.",
        stack: ["ASP.NET Core", "Angular", "EF Core", "SQL Server", "JWT"],
        challenge:
          "HR logic was tangled across the codebase, and concurrent edits to shared employee records threw EF Core concurrency exceptions in production.",
        solution:
          "Rebuilt on Clean Architecture with a CQRS-style split, added optimistic concurrency tokens, and isolated the payroll engine into its own module.",
        highlights: [
          "Clean Architecture with explicit layer boundaries",
          "Optimistic concurrency handling on shared records",
          "Modular payroll engine, independently testable",
          "JWT auth with role-based route protection",
        ],
        repoUrl: "https://github.com/Fazlerabbi-Fahad",
        accent: "cyan",
        metric: "Clean Architecture",
        featured: true,
        order: 1,
      },
      {
        title: "Qismah Hub",
        year: "2024",
        role: "Founder & full-stack engineer",
        blurb: "Print-on-demand operations dashboard tying together listings, orders and assets.",
        stack: ["React", "Node", "Express", "MongoDB"],
        challenge:
          "Running a POD brand across Amazon, Teepublic and Spreadshirt meant tracking listings by hand across three dashboards.",
        solution:
          "Built a unified MERN dashboard as one source of truth for products and order state, deployed on Firebase + Vercel.",
        highlights: [
          "Single source of truth across three sales channels",
          "Centralized asset and listing management",
          "Deployed on Firebase Hosting + Vercel API",
        ],
        liveUrl: "https://qismahhub.web.app",
        repoUrl: "https://github.com/Fazlerabbi-Fahad",
        accent: "cyan",
        metric: "Deployed",
        featured: true,
        order: 2,
      },
    ]);
    logger.info("Sample projects created");
  }

  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.create({
      quote: "Reliable, communicative, and ships clean work. Delivered exactly what we scoped.",
      author: "Freelance client",
      title: "via Freelancer.com",
      rating: 5,
      order: 1,
    });
    logger.info("Sample testimonial created");
  }

  logger.info("Seed complete");
  process.exit(0);
}

seed().catch((err) => { logger.error({ err }, "Seed failed"); process.exit(1); });
