import { User } from '../models/auth/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { createApiResponse } from '../utils/apiResponce.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {

    //  --steps for register--
    // get user details from frontend
    const { username, email, fullname, password } = req.body


    // validations
    if (!username || username?.trim() === "") {
        throw new ApiError(400, "User name is required")
    }
    if (!email || email?.trim() === "") {
        throw new ApiError(400, "Email is required")
    }

    // check if user aleardy exists (by email)
    const checkUserExists = await User.findOne({ email })
    if (checkUserExists) {
        throw new ApiError(409, "User alerady exists")
    }

    // check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is rerquired")
    }

    // upload them to cloudinary
    const uploadAvatar = await uploadOnCloudinary(avatarLocalPath)
    if (!uploadAvatar) {
        throw new ApiError(400, "avatar is rerquired 2")
    }
    // create user object and add in db
    const userObject = {
        username, email, fullname, password, avatar: uploadAvatar.url ?? ""
    }

    const storeUser = await User.create(userObject)



    // remove password and refresh token form db_res data
    const currentUser = await User.findById(storeUser._id).select(
        "-password -refreshToken"
    )

    if (!currentUser) {
        throw new ApiError(500, "Somthing went wrong while creating register")
    }
    const apiRes = createApiResponse(200, currentUser, "user registered successfully")
    return res.status(201).json(apiRes)

    // check for user creation



})

export { registerUser }