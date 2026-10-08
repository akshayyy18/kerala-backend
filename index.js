const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const router = require("./router/userDetails")
const boatRoute = require("./router/boatRouter")
const bookingRouter = require("./router/CustomerBooking")
const adminBooking = require("./router/adminBooking")
// const adminData = require("./router/adminRouterData")
const AdminData = require("./router/adminRouterData")
const normalRouter = require("./router/normalAdminRouter")
const roleRouter = require("./router/roleRouter")

const seatRouter = require("./router/seatRouter")

const app = express()
mongoose.connect("mongodb://localhost:27017/tourism")


app.use(express.json())
app.use(cors())
app.use(router)
app.use(boatRoute)
app.use(bookingRouter)
app.use(adminBooking)
app.use(AdminData)
app.use(normalRouter)
app.use(roleRouter)
app.use(seatRouter)


app.listen(5000,()=>{
    console.log("server started .....")
})