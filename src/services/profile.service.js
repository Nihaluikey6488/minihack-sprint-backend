const userModel = require("../models/auth.model");
const profileModel = require("../models/profile.model");

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

function sanitizePortfolioItems(items = []) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      title: sanitizeString(item.title),
      description: sanitizeString(item.description),
      image: sanitizeString(item.image),
      projectUrl: sanitizeString(item.projectUrl),
      stack: sanitizeStringList(item.stack),
    }))
    .filter((item) => item.title || item.description || item.projectUrl);
}

async function getProfileService(userId) {
  const user = await userModel.findById(userId).select("-password -refreshToken");
  const profile = await profileModel.findOne({ userId });

  return {
    ...user.toObject(),
    ...profile?.toObject(),
  };
}

async function getProfileByIdService(userId) {
  const user = await userModel.findById(userId).select("-password -refreshToken");
  if (!user) {
    return null;
  }

  const profile = await profileModel.findOne({ userId });

  return {
    ...user.toObject(),
    ...profile?.toObject(),
  };
}

async function getAllProfilesService() {
  const profiles = await profileModel
    .find({})
    .populate("userId", "name email mobile")
    .lean();

  return profiles.map((profile) => {
    const user = profile.userId || {};
    const { userId, _id, ...profileFields } = profile;
    return {
      ...user,
      userId: user._id || userId,
      profileId: _id,
      ...profileFields,
    };
  });
}

async function updateProfileService(userId, payload) {
  // Update auth info (name, mobile)
  const authUpdates = {
    name: sanitizeString(payload.name),
    mobile: sanitizeString(payload.mobile),
  };

  // Update profile details
  const profileUpdates = {
    title: sanitizeString(payload.title),
    location: sanitizeString(payload.location),
    bio: sanitizeString(payload.bio),
    profilePicture: sanitizeString(payload.profilePicture),
    bannerImage: sanitizeString(payload.bannerImage),
    skills: sanitizeStringList(payload.skills),
    socialLinks: {
      github: sanitizeString(payload.socialLinks?.github),
      linkedin: sanitizeString(payload.socialLinks?.linkedin),
      twitter: sanitizeString(payload.socialLinks?.twitter),
      website: sanitizeString(payload.socialLinks?.website),
    },
    portfolioItems: sanitizePortfolioItems(payload.portfolioItems),
  };

  // Update user
  const user = await userModel
    .findByIdAndUpdate(userId, authUpdates, {
      returnDocument: "after",
      runValidators: true,
    })
    .select("-password -refreshToken");

  // Update or create profile
  let profile = await profileModel.findOne({ userId });

  if (!profile) {
    profile = await profileModel.create({
      userId,
      ...profileUpdates,
    });
  } else {
    profile = await profileModel.findByIdAndUpdate(profile._id, profileUpdates, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  return {
    ...user.toObject(),
    ...profile.toObject(),
  };
}

module.exports = {
  getProfileService,
  getProfileByIdService,
  getAllProfilesService,
  updateProfileService,
};
