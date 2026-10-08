const dataBase = require("../model/customerBookingModel");
const boat = require("../model/boat");

exports.getallBookings = async (req, res) => {
  try {
    let booking;

    if (req.admin.role.name === "superAdmin") {
      booking = await dataBase
        .find()
        .populate("customerId", "name email mobileNumber")
        .populate(
          "boatId",
          "boatName boatType category facility capacity price location destination image createdBy",
        )
        .populate("seatIds", "seatNumber row price");
    } else {
      const boats = await boat
        .find({
          createdBy: req.user.id,
        })
        .select("_id");

      const boatIds = boats.map((item) => item._id);

      booking = await dataBase
        .find({
          boatId: { $in: boatIds },
        })
        .populate("customerId", "name email mobileNumber")
        .populate(
          "boatId",
          "boatName boatType category facility capacity price location destination image createdBy",
        )
        .populate("seatIds", "seatNumber row price");
    }

    if (booking.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All bookings fetched successfully",
      count: booking.length,
      data: booking,
    });
  } catch (error) {
    console.error("Get All Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

exports.getSingleBooking = async (req, res) => {
  try {
    const { id } = req.params;

    let booking;

    if (req.admin.role.name === "superAdmin") {
      console.log("BOOKING ID:", id);

      booking = await dataBase
        .findById(id)
        .populate("customerId", "name email mobileNumber")
        .populate(
          "boatId",
          "boatName boatType category facility capacity price location destination image createdBy",
        )
        .populate("seatIds", "seatNumber row price");

    } else {
      const boats = await boat.find({
        createdBy: req.user.id,
      });

      const boatIds = boats.map((boat) => boat._id);

      booking = await dataBase
        .findOne({
          _id: id,
          boatId: { $in: boatIds },
        })
        .populate("customerId", "name email mobileNumber")
        .populate(
          "boatId",
          "boatName boatType category facility capacity price location destination image createdBy",
        ).populate("sestIds", "seatNumber row price")
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or you are not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Get Single Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { bookingStatus } = req.body;

    const allowedStatus = ["Upcoming", "Completed"];
    if (!allowedStatus.includes(bookingStatus)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }
    let booking;

    if (req.admin.role.name === "superAdmin") {
      booking = await dataBase.findByIdAndUpdate(
        id,
        { bookingStatus },
        {
          new: true,
          runValidators: true,
        },
      );
    } else {
      const boats = await dataBase
        .find({
          createdBy: req.user.id,
        })
        .select("_id");

      const boatIds = boats.map((boat) => boat._id);

      booking = await dataBase.findOneAndUpdate(
        {
          _id: id,
          boatId: { $in: boatIds },
        },
        {
          bookingStatus,
        },
        {
          new: true,
          runValidators: true,
        },
      );
    }

    return res
      .status(200)
      .json({ message: "Booking status updated successfully", data: booking });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};
