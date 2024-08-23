import { ApiError } from "../utils/apiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessTokken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Acces and Refresh Token Error", error);
  }
};

// Todos for Register User
// 1: We need the user details as we describbed in schema --> username, Full Name, email, passowrd to create a user
// 2: Apply validations that the required fields should be empty
// 3: Checkk if user already exist check with ---> username
// 4: check avatar vallidation if it uploads or not
// 5: Create user in D
// 6: Remove password and refrsh token from the document
// 7: Return response object
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email, fullName } = req.body;

  if (!username || !password || !email || !fullName) {
    throw new ApiError(400, "All fields are required");
  } else {
    console.log(
      `\nUser Name:${username}\nFull Name ${fullName} \nEmail: ${email}`
    );
  }

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) {
    throw new ApiError(409, "User Already Exist");
  } else {
    console.log("User Created Successfully");
  }

  const avatarLocalPath = await req.files?.avatar[0]?.path;
  // const coverImageLocalPath = await req.files?.coverImage[0].path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = await req.files?.coverImage[0].path;
  }

  console.log(avatarLocalPath);
  console.log(coverImageLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar path is required");
  }

  const avatar = await uploadFileOnCloudinary(avatarLocalPath);
  const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const isUserCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!isUserCreated) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, isUserCreated, "User created successfully"));
});

// Login User Todos
// - we need username/email and password from user
// - check it in database if the user entered detail match to any user created in database
// - check passowrd
// - access and refresh token
// - send cokie
//
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !username) {
    throw new ApiError(400, "User or email required");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(400, "Invalid email or username");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("Access Token", accessToken, options)
    .cookie("Refresh Token", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {});
export { registerUser, loginUser, logoutUser };
