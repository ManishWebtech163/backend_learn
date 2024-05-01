import mongoose from "mongoose";

// --connect to database--
const connectToDataBase = async () => {
  try {
    await mongoose.connect(`${process.env.mongo_db_url}/${process.env.DB_NAME}`);
    return { success: true, message: "Connected to database" };
  } catch (err) {
    console.log(err, "err");
    return { success: false, message: "Error connecting to database" };
  }
};

export default connectToDataBase;
