import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  api_key: process.env.CLOUDINARY_API_KEY,
});

const uploadOnCludinary = async function (localFilePath,folderName=null) {
  try {
    if (!localFilePath) return null;
    const publicURL = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder:folderName
    });
    fs.unlinkSync(localFilePath);
    console.log("File Upload On Cloudinary Success ");
    return publicURL;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log(error?.message);
    return null;
  }
};

export { uploadOnCludinary };
