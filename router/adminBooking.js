const express = require("express")
const { getallBookings, getSingleBooking, updateStatus } = require("../controller/adminBooking")
const authMiddleware = require("../controller/AuthMiddleware")
const permissionMiddleware = require("../controller/permissionMiddleware")



const adminBooking = express.Router()

adminBooking.get("/getAll", authMiddleware,permissionMiddleware("viewBookings"),getallBookings)
adminBooking.get("/getSingleBooking/:id",authMiddleware, permissionMiddleware("viewBookings"),getSingleBooking)
adminBooking.put("/updateStatus/:id",authMiddleware, permissionMiddleware("viewBookings"),updateStatus  )


module.exports = adminBooking