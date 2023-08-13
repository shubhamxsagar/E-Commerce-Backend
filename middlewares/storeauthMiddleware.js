const Store = require("../models/storeModel")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")

const storeMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                // console.log(decoded)
                const store = await Store.findById(decoded?.id)
                req.store = store
                next()
            }
        } catch (error) {
            throw new Error("Not Authorized token expired, Please Login again")
        }
    } else {
        throw new Error("There is no token attached to header")
    }
})

const isStore = asyncHandler(async (req, res, next) => {
    const { storeId } = req.store
    const adminType = await Store.findOne({ storeId })
    if (adminType.type != "store") {
        throw new Error("You are not Store")
    } else {
        next()
    }
    // console.log(req.user)
})
module.exports = { storeMiddleware, isStore }