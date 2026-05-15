const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const {
  createBlogService,
  getBlogsService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
} = require("../services/blogs.service");

const createBlogController = asyncHandler(async (req, res) => {
  const blog = await createBlogService(req.user._id, req.body);

  return res
    .status(201)
    .json(new ApiResponse("blog created successfully", blog));
});

const getBlogsController = asyncHandler(async (req, res) => {
  const blogs = await getBlogsService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse("blogs fetched successfully", blogs));
});

const getAllBlogsController = asyncHandler(async (req, res) => {
  const blogs = await getAllBlogsService();

  return res
    .status(200)
    .json(new ApiResponse("all blogs fetched successfully", blogs));
});

const getBlogByIdController = asyncHandler(async (req, res) => {
  const blog = await getBlogByIdService(req.params.blogId);

  return res
    .status(200)
    .json(new ApiResponse("blog fetched successfully", blog));
});

const updateBlogController = asyncHandler(async (req, res) => {
  const blog = await updateBlogService(
    req.user._id,
    req.params.blogId,
    req.body
  );

  return res
    .status(200)
    .json(new ApiResponse("blog updated successfully", blog));
});

const deleteBlogController = asyncHandler(async (req, res) => {
  const blog = await deleteBlogService(req.user._id, req.params.blogId);

  return res
    .status(200)
    .json(new ApiResponse("blog deleted successfully", blog));
});

module.exports = {
  createBlogController,
  getBlogsController,
  getBlogByIdController,
  updateBlogController,
  deleteBlogController,
  getAllBlogsController,
};
