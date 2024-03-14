import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  // ye middleware ham  logged in ke liye use kare ge nahi sammaj aaye to video(15 timestamp :40:00)
  //short me samajna hai to timestamp: 55: 00 par dekho

  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); // replace kar rahe ha docs se dekta tha jwt ke

    if (!token) {
      throw new ApiError(401, "UnAuthorized Request");
    }

    console.log(token);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // video 16 timestamp 15:00

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invaild Access Token");
    }

    req.user = user; // isme ham user ko assign kar rahe hai is filed mai ham yaha req.dheeraj bgu kar sakte the
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invaild Access token");
  }
});
