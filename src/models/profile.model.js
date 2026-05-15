const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    title: {
      type: String,
      trim: true,
      default: "Full Stack Developer",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },

    profilePicture: {
      type: String,
      trim: true,
      default: "",
    },

    bannerImage: {
      type: String,
      trim: true,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    socialLinks: {
      github: {
        type: String,
        trim: true,
        default: "",
      },
      linkedin: {
        type: String,
        trim: true,
        default: "",
      },
      twitter: {
        type: String,
        trim: true,
        default: "",
      },
      website: {
        type: String,
        trim: true,
        default: "",
      },
    },

    portfolioItems: {
      type: [
        {
          title: {
            type: String,
            trim: true,
            default: "",
          },
          description: {
            type: String,
            trim: true,
            default: "",
          },
          image: {
            type: String,
            trim: true,
            default: "",
          },
          projectUrl: {
            type: String,
            trim: true,
            default: "",
          },
          stack: {
            type: [String],
            default: [],
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const profileModel = mongoose.model("profile", profileSchema);

module.exports = profileModel;
