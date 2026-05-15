const blogModel = require("../models/blogs.model");
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

async function createBlogService(userId, payload) {
  const { title, content, tags, category, published } = payload;

  if (!title) {
    throw new ApiError(400, "Blog title is required");
  }

  const blog = await blogModel.create({
    userId,
    title: sanitizeString(title),
    content: sanitizeString(content),
    category: sanitizeString(category),
    tags: sanitizeStringList(tags),
    published: published === true,
  });

  // populate uploader name before returning
  await blog.populate("userId", "name");
  return blog;
}

async function getBlogsService(userId) {
  const blogs = await blogModel
    .find({ userId })
    .populate("userId", "name")
    .sort({ createdAt: -1 });
  return blogs;
}

async function getAllBlogsService() {
  const blogs = await blogModel
    .find({})
    .populate("userId", "name")
    .sort({ createdAt: -1 });
  return blogs;
}

async function getBlogByIdService(blogId) {
  const blog = await blogModel.findById(blogId).populate("userId", "name");

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
}

async function updateBlogService(userId, blogId, payload) {
  const { title, content, tags, category, published } = payload;

  const updates = {
    title: title ? sanitizeString(title) : undefined,
    content: sanitizeString(content),
    category: category ? sanitizeString(category) : undefined,
    tags: sanitizeStringList(tags),
  };

  if (published !== undefined) {
    updates.published = Boolean(published);
  }

  Object.keys(updates).forEach(
    (key) => updates[key] === undefined && delete updates[key]
  );

  const blog = await blogModel.findOneAndUpdate(
    { _id: blogId, userId },
    updates,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
}

async function deleteBlogService(userId, blogId) {
  const blog = await blogModel.findOneAndDelete({ _id: blogId, userId });

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  return blog;
}

module.exports = {
  createBlogService,
  getBlogsService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
};
