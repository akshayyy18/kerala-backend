const seatModel = require("../model/seatModel");

const Boat = require("../model/boat");

const Booking = require("../model/customerBookingModel");

exports.createSeat = async (req, res) => {
  try {
    const { boatId, seatNumber, row, price } = req.body;
    // console.log("Received boatId:", boatId);

    if (!boatId || !seatNumber || !row || price === undefined) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    const boat = await Boat.findById(boatId);

    if (!boat) {
      return res.status(400).json({ message: "boat not found" });
    }

    const existing = await seatModel.findOne({ boatId, seatNumber });

    if (existing) {
      return res.status(400).json({ message: "Seat Already exists" });
    }

    const seat = await seatModel.create({
      boatId,
      seatNumber,
      row,
      price,
    });

    return res
      .status(200)
      .json({ message: "Seat Created Successfull", data: seat });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create seat",
      error: error.message,
    });
  }
};

exports.getSeat = async (req, res) => {
  try {
    const { boatId } = req.params;

    console.log("REQ PARAMS:", req.params);
    console.log("BOAT ID:", boatId);  

    const seats = await seatModel.find({ boatId });

    return res
      .status(200)
      .json({ message: "booking fetched", count: seats.length, data: seats });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Fetch Seats",
      error: error.message,
    });
  }
};

exports.getBookedSeats = async (req, res) => {
  try {
    const { boatId } = req.params;
    // console.log(boatId)

    const { date, time } = req.query;
    // console.log(date)
    // console.log(time)

    if (!boatId || !date || !time) {
      return res.status(400).json({ message: "All Fiellds are requires " });
    }

    const bookingDate = new Date(date)
    // console.log(bookingDate)

    const bookings = await Booking.find({
      boatId: boatId,
      date: bookingDate,
      time: time,
      bookingStatus: "Upcoming",
    });

    const bookedSeatIds = bookings.flatMap((booking) => booking.seatIds);

    return res
      .status(200)
      .json({
        success: true,
        count: bookedSeatIds.length,
        data: bookedSeatIds,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to Fetch Booked Seats",
      error: error.message,
    });
  }
};
