const express = require("express")
const { registerAdmin, loginNormalAdmin, getNormalProfile } = require("../controller/NormalAdminController")
const authMiddleware = require("../controller/AuthMiddleware")
const adminMiddleware = require("../controller/adminMiddleware")

const normalRouter = express.Router()

normalRouter.post("/create",authMiddleware,adminMiddleware,registerAdmin)
normalRouter.post("/logged",loginNormalAdmin )
normalRouter.get("/normalAdmin",authMiddleware,getNormalProfile)

module.exports = normalRouter
