const express = require("express");
const protectRoute = require("../middlewares/auth.middleware");
const {
  createBlogController,
  getBlogsController,
  getAllBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
} = require("../controllers/blogs.controller");

const router = express.Router();

router.post("/", protectRoute, createBlogController);
router.get("/", protectRoute, getBlogsController);
router.get("/all", protectRoute, getAllBlogsController);
router.get("/:blogId", protectRoute, getBlogByIdController);
router.patch("/:blogId", protectRoute, updateBlogController);
router.delete("/:blogId", protectRoute, deleteBlogController);

module.exports = router;
