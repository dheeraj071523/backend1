import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";
import jwt from "jsonwebtoken";

const generateAcccessAndRefreshTokens = async (userId) => {
  // yaha par ham web request nahi bhej rahe hai isliye ham asyncHandler ka use nahi kar rhae hai // is method ka use sirf isi file ke pass use kara rahe hai ham
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAcccessToken();
    const refreshToken = user.generateRefreshToken();
    // refreh token ko database mai bhi store karnaa padega

    user.refreshToken = refreshToken; // database me save // ab save karna padega
    await user.save({ validateBeforeSave: false }); // ye password ko bhi save kara leta par hamare pass abhi password nahi hai to abhi koi vaildation nahi lagega

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while genertaing the access and refreh token "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // ye ek high order function hai

  //step of the register route  // logic buliding
  // get user details from fronted
  // vaildation - not empty
  // check if the user already exists: username, email
  // upload them cloudinary,avater
  // create user object --create entry in db
  // remove password and refresh token field from response
  //  check for user creation
  // return res

  const { fullname, email, username, password } = req.body;
  // desctruing of the data here we take the data postman or req to particular object each value data

  // if (fullname === "") {
  //   throw new ApiError(400, "fullname is required")
  // }

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  console.log(req.body);

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already existed");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path; // req.files this access give the multer // ? this is called optionaly // [0] give the object  // here wwe access the file
  //  here the file storage in the local storage

  //const coverImageLocalPath = req.files?.coverImage[0]?.path; // here we take the coverImage file access
  console.log("hi");
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  console.log(req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // see the user is actully created or not this _id give the  mongoDB

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // step of the login
  // req.body => data
  // find the user
  // password   check
  // access and reffresh token
  // send cookies

  const { username, password, email } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "email or username is required");
  }

  // databases dusare conntinate me hota hai to data lane me time lagta hai isliya await
  const user = await User.findOne({
    // find one databases me first same milne par return kar dega jo pahelae same mila us docs ko
    $or: [{ username }, { email }], // or mongodb ke operator me se ek hai ye in dono me se ek value same milne par returnn ker dega // ye query hai
  });

  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  const isPasswoordVaild = await user.isPasswordCorrect(password); // yaha par ispasswordcorrect user defined method hai isko mongodb nahi deta hai to User ke instance user me iska access milta hai User ek model hai user nahi

  if (!isPasswoordVaild) {
    throw new ApiError(401, "invaild user credentials");
  }

  const { accessToken, refreshToken } = await generateAcccessAndRefreshTokens(
    user._id
  );

  // yaha par ham vapas database ko call mar rahhe hai kyuki pahele jab user ban raha tha tab token khali tha lekin function call karne ke badd nahi hai to vapas call mar rhae hai
  // yaha par ham pahale vale user ko vapas intilize kar sakte hai hame dekhna hai kon kamm expensive hai or optimize
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // select ka use ham unwantes filed ko hatane ke liye karte hai

  // ab ham cookie bheje ge // cookie  bhejne ke liye kuch option lagte hai // ye option kuch nahi ek object hota hai jo ye value leta hai
  const option = {
    httpOnly: true,
    secure: true,
  };

  // ab ham response return kare ge with cookie // cookie ek midlewaree hai isko hamane app.js mai routes se pahale uuse kia hai
  return res
    .status(200)
    .cookie("accessToken", accessToken, option) // cookie(key,value,option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
          // yeh ApiError ki data fiels hai
          user: loggedUser,
          accessToken,
          refreshToken, // yaha par ham user ko coookie set karane ka option de rahe hai // vese yah achi practice nahi hai
        },
        "USer loggeed in successfully"
      )
    );
});

const loggoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    // mongoose ka method
    req.user._id, // req.user middleware se mila user routes file mai
    {
      $unset: {
        // mogo ka ek or operator ye value ko set ya change kar sakta hai files mai
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "user logged Out"));
});

// refresh token ke endpoint hai
const refrehAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken; // yaha req.body ka use isliye kar rahe hai agr koi mobile mai use kar raha ho to

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized requet");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ); // TOEKN VERIFY

    const user = await User.findById(decodedToken?._id); // datadbase se decoded token find kar rahe hai video 16 tiestamp 18:00

    if (!user) {
      throw new ApiError(401, "Invaild refrsh token");
    }

    if (!incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const option = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAcccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refrshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invaild refreh token");
  }
});

export { registerUser, loginUser, loggoutUser, refrehAccessToken };
