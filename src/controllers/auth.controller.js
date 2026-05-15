const asyncHandler = require("../middlewares/asyncHandler");
const {
  registerService,
  loginService,
} = require("../services/auth.service");
const ApiResponse = require("../utils/apiResponse");

const { searchUsersService } = require("../services/auth.service");

let registerController = asyncHandler(async (req, res) => {
  let { accessToken, refreshToken, user } = await registerService(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 168 * 60 * 60 * 1000,
  });
  return res
    .status(201)
    .json(new ApiResponse("user registered successfully", user));
});

let loginController = asyncHandler(async (req, res) => {
  let { accessToken, refreshToken, user } = await loginService(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 168 * 60 * 60 * 1000,
  });
  return res.status(200).json(new ApiResponse("user loggedin successfully", user));
});

const searchUsersController = asyncHandler(async (req, res) => {
  const { q, limit } = req.query;
  const users = await searchUsersService(q, limit);
  return res.status(200).json(new ApiResponse("users fetched successfully", users));
});

module.exports = {
  registerController,
  loginController,
  searchUsersController,
};
