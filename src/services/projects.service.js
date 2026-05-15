const projectModel = require("../models/projects.model");
const ApiError = require("../utils/apiError");

function sanitizeString(value = "") {
  return String(value).trim();
}

function sanitizeStringList(values = []) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => sanitizeString(value))
    .filter(Boolean);
}

async function createProjectService(userId, payload) {
  const { title, description, image, tags, githubLink, liveLink, techStack } =
    payload;

  if (!title) {
    throw new ApiError(400, "Project title is required");
  }

  const project = await projectModel.create({
    userId,
    title: sanitizeString(title),
    description: sanitizeString(description),
    image: sanitizeString(image),
    tags: sanitizeStringList(tags),
    githubLink: sanitizeString(githubLink),
    liveLink: sanitizeString(liveLink),
    techStack: sanitizeStringList(techStack),
  });

  // populate uploader name before returning
  await project.populate("userId", "name");
  return project;
}

async function getProjectsService(userId) {
  const projects = await projectModel
    .find({ userId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });

  return projects;
}

async function getAllProjectsService() {
  const projects = await projectModel
    .find({})
    .populate("userId", "name")
    .sort({ createdAt: -1 });
  return projects;
}

async function getProjectByIdService(userId, projectId) {
  const project = await projectModel
    .findOne({ _id: projectId, userId })
    .populate("userId", "name");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
}

async function updateProjectService(userId, projectId, payload) {
  const { title, description, image, tags, githubLink, liveLink, techStack, featured } =
    payload;

  const updates = {
    title: title ? sanitizeString(title) : undefined,
    description: sanitizeString(description),
    image: sanitizeString(image),
    tags: sanitizeStringList(tags),
    githubLink: sanitizeString(githubLink),
    liveLink: sanitizeString(liveLink),
    techStack: sanitizeStringList(techStack),
  };

  if (featured !== undefined) {
    updates.featured = Boolean(featured);
  }

  // Remove undefined values
  Object.keys(updates).forEach(
    (key) => updates[key] === undefined && delete updates[key]
  );

  const project = await projectModel.findOneAndUpdate(
    { _id: projectId, userId },
    updates,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
}

async function deleteProjectService(userId, projectId) {
  const project = await projectModel.findOneAndDelete({
    _id: projectId,
    userId,
  });

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return project;
}

module.exports = {
  createProjectService,
  getProjectsService,
  getAllProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
};
