import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const listProjects = asyncHandler(async (req, res) => {
  const filter = {};
  if (!req.query.all) filter.published = true;
  if (req.query.featured) filter.featured = true;
  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(projects);
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) throw ApiError.notFound("Project not found");
  res.json(project);
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) throw ApiError.notFound("Project not found");
  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw ApiError.notFound("Project not found");
  res.json({ ok: true });
});

export const toggleProjectPublish = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw ApiError.notFound("Project not found");
  project.published = !project.published;
  await project.save();
  res.json(project);
});
