const jwt = require("jsonwebtoken");
const userModel = require("../models/auth.model");
const ApiError = require("../utils/apiError");

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, part) => {
    const [key, ...rest] = part.trim().split("=");

    if (!key) {
      return cookies;
    }

    cookies[key] = decodeURIComponent(rest.join("="));
    return cookies;
  }, {});
}

const protectRoute = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : "";
    const accessToken = cookies.accessToken || bearerToken;

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_ACCESS);
    const user = await userModel
      .findById(decodedToken.userId)
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, "Invalid or expired session"));
  }
};

module.exports = protectRoute;
