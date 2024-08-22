import { ApiError } from "../utils/apiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

// 1: We need the user details aswe describbed in schema --> username, Full Name, email, passowrd to create a user
// 2: Apply validations that the required fields should be empty
// 3: Checkk if user already exist check with ---> username
//
export const registerUser = asyncHandler(async (req, res) => {
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
