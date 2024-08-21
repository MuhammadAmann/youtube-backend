import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.env.CLOUDINARY_API_KEY_SECRET,
});

export const uploadFileOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(result);
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
