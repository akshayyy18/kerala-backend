const dataBase = require("../model/customerBookingModel");

const Boat = require("../model/boat");

const Customer = require("../model/userData");
const Seat = require("../model/seatModel");

exports.creatBooking = async (req, res) => {
  try {
    const { boatId, date, time, seatIds } = req.body;

    const customerId = req.user.id;

    if (
      !boatId ||
      !date ||
      !time ||
      !Array.isArray(seatIds) ||
      seatIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Boat, date, time and seats are required",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const boat = await Boat.findById(boatId);

    if (!boat) {
      return res.status(404).json({
        success: false,
        message: "Boat not found",
      });
    }

    if (boat.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Boat is not available",
      });
    }

    const passengers = seatIds.length;

    if (passengers > boat.capacity) {
      return res.status(400).json({
        success: false,
        message: `Maximum capacity is ${boat.capacity} passengers`,
      });
    }

    const seats = await Seat.find({
      _id: { $in: seatIds },
      boatId: boatId,
    });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid seat selection",
      });
    }

    const booking = await dataBase.create({
      customerId: customer._id,
      customerName: customer.name,
      mobileNumber: customer.mobileNumber,

      boatId: boat._id,
      boatName: boat.boatName,

      date,
      time,

      seatIds: seatIds,

      passengers: passengers,

      amount: boat.price,

      bookingStatus: "Upcoming",
    });

    return res.status(201).json({
      success: true,
      message: "Booking Created Successfully",
      data: booking,
    });
  } catch (error) {
    console.log("Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Booking creation unsuccessful",
      error: error.message,
    });
  }
};

exports.getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user.id;

    const bookings = await dataBase
      .find({
        customerId: customerId,
      })
      .populate(
        "boatId",
        "boatName boatType category facility capacity price location destination image",
      )
      .populate("seatIds", "seatNumber row price")

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings Found" });
    }

    return res.status(200).json({
      success: true,
      message: "Customer bookings fetched successfully",
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(404).json({ message: "failed to Fetch" });
  }
};

exports.customerSingleBooking = async (req, res) => {
  try {
    const { id } = req.params;


    const bookings = await dataBase
      .findOne({
        _id: id,
        customerId: req.user.id,
      })
      .populate(
        "boatId",
        "boatName boatType category facility capacity price location destination image",
      )
      .populate("seatIds", "seatNumber row");

    if (!bookings) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Individual booking fetched successfully",
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "failed to ferch th eindividual bookings of an customer",
      error: error.message,
    });
  }
};
