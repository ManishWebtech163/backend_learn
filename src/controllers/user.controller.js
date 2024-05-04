import { validateHeaderName } from 'http';
import { User } from '../models/auth/user.model.js';
import { createApiError } from '../utils/apiError.js';
import { createApiResponse } from '../utils/apiResponce.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';


// -register-
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

// -login-
const loginUser = asyncHandler(async (req, res) => {
    // get user credentials
    const { email, password } = req.body

    // validate user email or password
    if (!email || !password) {
        const errRes = createApiError(400, "email or password field is requied")
        return res.status(400).json(errRes)
    }
    // check user exist by (email)
    const findUser = await User.findOne({ email })

    if (!findUser) {
        const errRes = createApiError(404, "User not found")
        return res.status(404).json(errRes)
    }

    // check user password
    const userPasswordMatch = await findUser.isPassword(password)

    if (!userPasswordMatch) {
        const errRes = createApiError(401, "Password not match")
        return res.status(401).json(errRes)
    }

    // genrate access token and refresh token
    const userAccessToken = await findUser.generateAccessToken()
    const userRefershToken = await findUser.refreshAccessToken()

    if (!userAccessToken || !userRefershToken) {
        const errRes = createApiError(500, "Something went wrong while gerate tokens")
        return res.status(500).json(errRes)
    }

    // save in db
    findUser.refreshToken = userRefershToken
    try {
        await findUser.save({ validateBeforeSave: false })
    } catch (error) {
        const errRes = createApiError(500, "Something went wrong")
        return res.status(500).json(errRes)
    }

    console.log(findUser, "findUser");


    // send cookie ans send res
    const getUpdatedUser = await User.findOne({ _id: findUser._id }).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    const apiRes = createApiResponse(200, { getUpdatedUser, userAccessToken, userRefershToken }, "User login successfully")

    return res.status(200)
        .cookie("accessToken", userAccessToken, options)
        .cookie("refreshToken", userRefershToken, options)
        .json(apiRes)

})


// --logout user--
const logOutUser = asyncHandler(async (req, res) => {
    // const {} = req.
    const as = await User.fin
})


export { registerUser, loginUser, logOutUser }