const userModel = require("../models/auth.model");
const profileModel = require("../models/profile.model");
const ApiError = require("../utils/apiError");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");

let registerService = async (data) => {
  let { name, email, password, mobile } = data;
  if (!name || !email || !password || !mobile)
    throw new ApiError(400, "All fields are required");

  let isExisted = await userModel.findOne({
    email,
  });

  if (isExisted) throw new ApiError(409, "Email already registered");
  let newUser = await userModel.create({
    name,
    email,
    password,
    mobile,
  });

  // Create profile document for the user
  const profile = await profileModel.create({
    userId: newUser._id,
  });

  let accessToken = generateAccessToken(newUser._id);
  let refreshToken = generateRefreshToken(newUser._id);
  newUser.refreshToken = refreshToken;
  await newUser.save();

  const user = await userModel
    .findById(newUser._id)
    .select("-password -refreshToken");

  // Return merged user and profile data
  return {
    accessToken,
    refreshToken,
    user: {
      ...user.toObject(),
      ...profile.toObject(),
    },
  };
};

let loginService = async (data) => {
  let { email, password } = data;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  let isExisted = await userModel
    .findOne({ email })
    .select("+password");

  if (!isExisted) {
    throw new ApiError(404, "User not found");
  }

  let comparePass = await isExisted.comparePassword(password);

  if (!comparePass) {
    throw new ApiError(401, "Invalid credentials");
  }

  let accessToken = generateAccessToken(isExisted._id);

  let refreshToken = generateRefreshToken(isExisted._id);

  isExisted.refreshToken = refreshToken;

  await isExisted.save();

  const user = await userModel
    .findById(isExisted._id)
    .select("-password -refreshToken");

  // Fetch profile data and merge
  const profile = await profileModel.findOne({ userId: isExisted._id });

  return {
    accessToken,
    refreshToken,
    user: {
      ...user.toObject(),
      ...(profile ? profile.toObject() : {}),
    },
  };
};

/**
 * Search registered users by name or email (case-insensitive, partial match).
 * @param {string} query
 * @param {number} limit
 */
let searchUsersService = async (query = "", limit = 50) => {
  if (!String(query).trim()) return [];

  const regex = new RegExp(String(query).trim(), "i");

  const users = await userModel
    .find({ $or: [{ name: regex }, { email: regex }] })
    .select("-password -refreshToken")
    .limit(Number(limit) || 50)
    .lean();

  return users;
};

module.exports = {
  registerService,
  loginService,
  searchUsersService,
};
