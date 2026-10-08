const express = require("express")
const { authorize } = require("../controller/authorize")
const { authorization } = require("../controller/auth")
const { creatBooking, getCustomerBookings, customerSingleBooking } = require("../controller/customerBooking")

const bookingRouter = express.Router()

bookingRouter.post("/book-data",authorization,authorize("customer"),creatBooking)
bookingRouter.get("/book-data",authorization,authorize("customer"), getCustomerBookings)
bookingRouter.get("/book-data/:id", authorization, customerSingleBooking)

module.exports = bookingRouter