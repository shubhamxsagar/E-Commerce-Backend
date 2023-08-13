const { compareSync } = require("bcrypt")
const User = require("../models/userModel")
const Product = require("../models/productModel")
const Cart = require("../models/cartModel")
const Store = require("../models/storeModel")
const asyncHandler = require("express-async-handler")
const { generateToken } = require("../config/jwtToken")
const validateMongoDbId = require("../utils/validateMongodbId")
const { generateRefreshToken } = require("../config/refreshToken")
const jwt = require("jsonwebtoken")

const createUser = asyncHandler(async (req, res) => {
    const csdno = req.body.csdno
    const findUser = await User.findOne({ csdno: csdno })
    if (!findUser) {
        const newUser = await User.create(req.body)
        res.json(newUser)
    } else {
        throw new Error('User Exists')
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { csdno, dob } = req.body
    const csdExist = await User.findOne({ csdno })
    if (!csdExist) {
        throw new Error('Invalid CSD Number')
    } else if (dob != csdExist.dob) {
        throw new Error('Invalid Date of birth')
    } else {
        const refreshToken = await generateRefreshToken(csdExist?._id)
        const updateUser = await User.findByIdAndUpdate(csdExist?.id,
            {
                refreshToken: refreshToken,
            },
            { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id: csdExist?._id,
            firstname: csdExist?.firstname,
            lastname: csdExist?.lastname,
            email: csdExist?.email,
            mobile: csdExist?.mobile,
            pincode: csdExist?.pincode,
            csdno: csdExist?.csdno,
            dob: csdExist?.dob,
            token: generateToken(csdExist?._id)
        })
    }
})
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    // console.log(cookie)
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
    const refreshToken = cookie.refreshToken
    // console.log(refreshToken)
    const user = await User.findOne({ refreshToken })
    if (!user) throw new Error("Refresh Token not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("Something Went Wrong with refresh token")
        }
        const accessToken = generateToken(user?._id)
        res.json({ accessToken })
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
});


const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaUser = await User.findById(id)
        res.json({
            getaUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deleteaUser = await User.findByIdAndDelete(id)
        res.json({
            deleteaUser
        })
    } catch (error) {
        throw new Error(error)
    }
})

const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const updateaUser = await User.findByIdAndUpdate(
            _id, {
            firstname: req?.body?.firstname,
            lastname: req?.body.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            pincode: req?.body?.pincode,
        },
            {
                new: true,
            }
        )
        res.json(updateaUser)
    } catch (error) {
        throw new Error(error)
    }
})

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body
    const { _id } = req.user
    const { storeId } = req.body
    validateMongoDbId(_id)
    try {
        let products = []
        const user = await User.findById(_id)
        const alreadyExistCart = await Cart.findOne({ orderby: user._id })
        if (alreadyExistCart) {
            alreadyExistCart.deleteOne()
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i]._id
            object.count = cart[i].count
            let getPrice = await Product.findById(cart[i]._id).select("price").exec()
            object.price = getPrice.price
            products.push(object)
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count
        }
        let newCart = await new Cart({
            storeId,
            products,
            cartTotal,
            orderby: user?._id,
        }).save()
        res.json(newCart)
    } catch (error) {
        throw new Error(error)
    }
})

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const cart = await Cart.findOne({ orderby: _id })
        res.json(cart)
    } catch {
        throw new Error(error)
    }
})

const findNearestCSD = asyncHandler(async (req, res) => {
    try {
        // const findNearestCSD = await Store.find(req.query)
        // console.log(req.query)
        // res.json(findNearestCSD)
        let { pincode } = req.query
        pincode = pincode.substring(0, pincode.length - 2);

        const querObject = {}
        if (pincode) {
            querObject.pincode = { $regex: pincode, $options: "i" }
        }
        console.log(pincode)

        const data = await Store.find(querObject)
        res.json(data)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createUser, loginUser, getallUser,
    getaUser, deleteaUser, updateaUser,
    handleRefreshToken,
    logout, userCart, getUserCart, findNearestCSD
}