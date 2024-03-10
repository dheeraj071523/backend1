import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // full form of the file system by default install in node js you can see  the docs

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", //detect which file is coming like pdf jpg etc
    });
    //file has been uploaded succesfully
    console.log("file is uploaded succesfully", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saveed temporary file as the upload operation get failed
    return null;
  }
};

export { uploadOnCloudinary };

// this file using we already known the file is storage in the local storage after  process will perform this file
