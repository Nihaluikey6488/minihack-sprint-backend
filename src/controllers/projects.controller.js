const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const {
  createProjectService,
  getProjectsService,
  getAllProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} = require("../services/projects.service");

const createProjectController = asyncHandler(async (req, res) => {
  const project = await createProjectService(req.user._id, req.body);

  return res
    .status(201)
    .json(new ApiResponse("project created successfully", project));
});

const getProjectsController = asyncHandler(async (req, res) => {
  const projects = await getProjectsService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse("projects fetched successfully", projects));
});

const getAllProjectsController = asyncHandler(async (req, res) => {
  const projects = await getAllProjectsService();

  return res
    .status(200)
    .json(new ApiResponse("all projects fetched successfully", projects));
});

const getProjectByIdController = asyncHandler(async (req, res) => {
  const project = await getProjectByIdService(req.user._id, req.params.projectId);

  return res
    .status(200)
    .json(new ApiResponse("project fetched successfully", project));
});

const updateProjectController = asyncHandler(async (req, res) => {
  const project = await updateProjectService(
    req.user._id,
    req.params.projectId,
    req.body
  );

  return res
    .status(200)
    .json(new ApiResponse("project updated successfully", project));
});

const deleteProjectController = asyncHandler(async (req, res) => {
  const project = await deleteProjectService(req.user._id, req.params.projectId);

  return res
    .status(200)
    .json(new ApiResponse("project deleted successfully", project));
});

module.exports = {
  createProjectController,
  getProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
  getAllProjectsController,
};
