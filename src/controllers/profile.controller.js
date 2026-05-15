const asyncHandler = require("../middlewares/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const {
  getProfileService,
  getProfileByIdService,
  getAllProfilesService,
  updateProfileService,
} = require("../services/profile.service");

const getMyProfileController = asyncHandler(async (req, res) => {
  const profile = await getProfileService(req.user._id);

  return res.status(200).json(new ApiResponse("profile fetched successfully", profile));
});

const getProfileByIdController = asyncHandler(async (req, res) => {
  const profile = await getProfileByIdService(req.params.userId);

  if (!profile) {
    return res.status(404).json(new ApiResponse("Profile not found", null));
  }

  return res.status(200).json(new ApiResponse("profile fetched successfully", profile));
});

const getAllProfilesController = asyncHandler(async (req, res) => {
  const profiles = await getAllProfilesService();
  return res.status(200).json(new ApiResponse("profiles fetched successfully", profiles));
});

const updateMyProfileController = asyncHandler(async (req, res) => {
  const profile = await updateProfileService(req.user._id, req.body);

  return res.status(200).json(new ApiResponse("profile updated successfully", profile));
});

module.exports = {
  getMyProfileController,
  getProfileByIdController,
  getAllProfilesController,
  updateMyProfileController,
};
