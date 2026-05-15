const express = require("express");
const protectRoute = require("../middlewares/auth.middleware");
const {
  getMyProfileController,
  getAllProfilesController,
  getProfileByIdController,
  updateMyProfileController,
} = require("../controllers/profile.controller");

const router = express.Router();

router.get("/me", protectRoute, getMyProfileController);
router.patch("/me", protectRoute, updateMyProfileController);
router.get("/all", protectRoute, getAllProfilesController);
router.get("/:userId", protectRoute, getProfileByIdController);

module.exports = router;
