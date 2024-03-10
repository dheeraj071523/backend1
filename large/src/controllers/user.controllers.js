import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // ye ek high order function hai
  res.status(200).json({
    message: "ok",
  });
});

export { registerUser };
