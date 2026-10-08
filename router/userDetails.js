const express = require("express")
const { signup, login, profile } = require("../controller/userData")
const { authorization } = require("../controller/auth")
const { authorize } = require("../controller/authorize")

const userRouter = express.Router()

userRouter.post("/register",signup)
userRouter.post("/login",login)
userRouter.get("/profile",authorization,authorize("superAdmin","customer"),profile)

module.exports = userRouter