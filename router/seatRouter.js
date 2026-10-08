const express = require("express");
const {
  createSeat,
  getSeat,
  getBookedSeats,
} = require("../controller/seatModel");

const seatRouter = express.Router();

seatRouter.post("/admin/seatbooking", createSeat);
seatRouter.get("/admin/getSeats/:boatId", getSeat);
seatRouter.get("/admin/getBookedSeats/:boatId", getBookedSeats);

module.exports = seatRouter;
