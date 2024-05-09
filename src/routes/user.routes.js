import { Router } from "express";
import { logOutUser, loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authMiddlerWare from "../middlewares/auth.middlerware.js";

const user_router = Router()

// --user register--
user_router.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 }
]), registerUser)
// --user login--
user_router.route("/login").post(loginUser)
// --user logOutUser--
user_router.route("/logout").post(authMiddlerWare, logOutUser)
// --user refreshAccessToken--
user_router.route("/refresh_access_token").post(refreshAccessToken)



export default user_router