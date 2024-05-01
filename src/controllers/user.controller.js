import { User } from '../models/auth/user.model.js';
import { createApiError } from '../utils/apiError.js';
import { createApiResponse } from '../utils/apiResponce.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {

    //  --steps for register--
    // get user details from frontend
    const { username, email, fullname, password } = req.body


    // validations
    if (!username || username?.trim() === "") {
        const errorRes = createApiError(400, "User name is required")
        return res.status(400).json(errorRes)
    }
    if (!email || email?.trim() === "") {
        const errorRes = createApiError(400, "Email is required")
        return res.status(400).json(errorRes)
    }

    // check if user aleardy exists (by email)
    const checkUserExists = await User.findOne({ email })
    if (checkUserExists) {
        const errorRes = createApiError(409, "User alerady exists")
        return res.status(409).json(errorRes)
    }

    // check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path

    if (!avatarLocalPath) {
        const errorRes = createApiError(400, "avatar is rerquired")
        return res.status(400).json(errorRes)
    }

    // upload them to cloudinary
    const uploadAvatar = await uploadOnCloudinary(avatarLocalPath)
    if (!uploadAvatar) {
        const errorRes = createApiError(400, "avatar is rerquired 2")
        return res.status(500).json(errorRes)
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
        const errorRes = createApiError(500, "Somthing went wrong while creating register")
        return res.status(500).json(errorRes)
    }
    const apiRes = createApiResponse(200, currentUser, "user registered successfully")
    return res.status(201).json(apiRes)

    // check for user creation



})

export { registerUser }