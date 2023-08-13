const express = require("express")
const { createStore, loginStore, updateaStore, getallStore } = require("../controller/storeCtrl")
const { route } = require("./authRoutes")
const router = express.Router()

router.post("/register", createStore)
router.post("/login", loginStore)
router.get("/all-stores", getallStore)
router.put("/:id", updateaStore)
module.exports = router