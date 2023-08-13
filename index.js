const bodyParser = require("body-parser")
const express = require('express')
const dbConnect = require("./config/dbConnect")
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000
const authRoute = require('./routes/authRoutes')
const storeRoute = require('./routes/storeRoutes')
const productRouter = require('./routes/productRoutes')
const { notFound, errorHandler } = require("./middlewares/errorHandler")
const cookieParser = require("cookie-parser")
const morgan = require('morgan')
dbConnect()

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/user', authRoute)
app.use('/api/store', storeRoute)
app.use('/api/product', productRouter)

app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
})