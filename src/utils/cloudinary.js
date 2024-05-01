import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
  cloud_name: "db07uyf4r",
  api_key: "614657975459934",
  api_secret: "nQsTo-Nu65zVrjEIZcdZMDWdBqI",
});

// ---
const uploadOnCloudinary = async (fileLink) => {
  try {
    if (!fileLink) {
      return null;
    }
    const result = await cloudinary.uploader.upload(fileLink, {
      resource_type: "auto",
    });
    //console.table(result, "result coludniry");
    fs.unlinkSync(fileLink); // remove the localy save file
    return result;
  } catch (err) {
    fs.unlinkSync(fileLink); // remove the localy save file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
