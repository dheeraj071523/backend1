import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // full form of the file system by default install in node js you can see  the docs

import EventEmitter from "events";

// Increase the maximum number of listeners for EventEmitter prototype
EventEmitter.defaultMaxListeners = 15;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadOnCloudinary = async (localFilePath) => {
//   console.log(localFilePath);
//   try {
//     if (!localFilePath) return null;
//     //upload the file on cloudinary

//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto", //detect which file is coming like pdf jpg etc
//     });

//     //file has been uploaded succesfully
//     console.log("file is uploaded succesfully", response.url);
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath); // remove the locally saveed temporary file as the upload operation get failed
//     return null;
//   }
// };

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload the file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // If there's an error during upload or unlinking the file, handle it here
    console.error("Error uploading file to Cloudinary:", error);
    if (localFilePath) {
      // Attempt to unlink the file
      try {
        fs.unlinkSync(localFilePath); // isko  yahi remove karne ke liyee sync asyc se background me move hoti rahti hai
      } catch (unlinkError) {
        console.error("Error unlinking file:", unlinkError);
      }
    }
    return null;
  }
};

export { uploadOnCloudinary };

// this file using we already known the file is storage in the local storage after  process will perform this file
