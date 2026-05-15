const express = require("express");
const protectRoute = require("../middlewares/auth.middleware");
const {
  createProjectController,
  getProjectsController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} = require("../controllers/projects.controller");

const router = express.Router();

// Protected routes - user must be logged in
router.post("/", protectRoute, createProjectController);
router.get("/", protectRoute, getProjectsController);
router.get("/all", protectRoute, getAllProjectsController);
router.get("/:projectId", protectRoute, getProjectByIdController);
router.patch("/:projectId", protectRoute, updateProjectController);
router.delete("/:projectId", protectRoute, deleteProjectController);

module.exports = router;
