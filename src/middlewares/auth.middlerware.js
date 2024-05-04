import { User } from "../models/auth/user.model";
import { createApiError } from "../utils/apiError"
import { asyncHandler } from "../utils/asyncHandler"
import jwt from "jsonwebtoken";

const authMiddlerWare = asyncHandler(async (req, res, next) => {
    try {
        const { accessToken } = req.cookie || req.header("Authorization")?.replace("Bearer ", "")
        if (!accessToken) {
            const errRes = createApiError(401, "Unauthorize request")
            return res.status(401).json(errRes)
        }
        // --verify token--
        const decodedToken = await jwt.verify(accessToken, process.env.access_token_secret);
        // -find user--
        const findUser = await User.findById(decodedToken._id).select("-password -refreshToken")
        if (!findUser) {
            const errRes = createApiError(401, "invalid access token")
            return res.status(401).json(errRes)
        }
        // --add userdata in request for get next step
        req.user = findUser
        next()
    } catch (err) {
        const errRes = createApiError(500, err?.message || "Something went wrong")
        return res.status(500).json(errRes)
    }
})

export default authMiddlerWare