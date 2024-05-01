import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const user_router = Router()

// --user register--
user_router.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 }
]), registerUser)



export default user_router