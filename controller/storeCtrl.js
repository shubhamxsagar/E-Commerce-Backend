const Store = require("../models/storeModel")
const asyncHandler = require("express-async-handler")
const { generateToken } = require("../config/jwtToken")
const validateMongoDbId = require("../utils/validateMongodbId")
const { generateRefreshToken } = require("../config/refreshToken")
const jwt = require("jsonwebtoken")

const createStore = asyncHandler(async (req, res) => {
    const pincode = req.body.pincode
    const findstore = await Store.findOne({ pincode: pincode })
    if (!findstore) {
        const newStore = await Store.create(req.body)
        res.json(newStore)
    } else {
        throw new Error('Store Already Registered')
    }
})

const loginStore = asyncHandler(async (req, res) => {
    const { storeId } = req.body
    const storeValid = await Store.findOne({ storeId })
    if (!storeValid) {
        throw new Error('Invalid Store ID')
    } else if (storeValid.status != "Verified") {
        throw new Error('Verification Pending from Government')
    } else {
        const refreshToken = await generateRefreshToken(storeValid?._id)
        const updateUser = await Store.findByIdAndUpdate(storeValid?.id,
            {
                refreshToken: refreshToken,
            },
            { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 100 * 60 * 60 * 1000,
        })
        res.json({
            _id: storeValid?._id,
            status: storeValid?.status,
            type: storeValid?.type,
            token: generateToken(storeValid?._id)
        })
    }
})

const getallStore = asyncHandler(async (req, res) => {
    try {
        const getallStore = await Store.find()
        res.json(getallStore)
    } catch (error) {
        throw new Error(error)
    }
})

const updateaStore = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const updateaStore = await Store.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        })
        res.json(updateaStore)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createStore, loginStore, updateaStore, getallStore }