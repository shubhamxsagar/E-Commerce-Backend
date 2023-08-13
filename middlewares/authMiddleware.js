const User = require("../models/userModel")
const Store = require("../models/storeModel")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                // console.log(decoded)
                const user = await User.findById(decoded?.id)
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error("Not Authorized token expired, Please Login again")
        }
    } else {
        throw new Error("There is no token attached to header")
    }
})
const isAdmin = asyncHandler(async (req, res, next) => {
    const { csdno } = req.user
    const adminType = await User.findOne({ csdno })
    if (adminType.type != "user") {
        throw new Error("Your are not a user")
    } else {
        next()
    }
    // console.log(req.user)
})

// const isStore = asyncHandler(async (req, res, next) => {
//     const { csdno } = req.store
//     const adminType = await User.findOne({ csdno })
//     if (adminType.status != "Valid") {
//         throw new Error("Store is not valid")
//     } else {
//         next()
//     }
//     // console.log(req.user)
// })
module.exports = { authMiddleware, isAdmin }