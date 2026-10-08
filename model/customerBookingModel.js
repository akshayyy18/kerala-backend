const mongoose = require("mongoose");

const BookingModel = mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },

    boatName: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    seatIds:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Seat",
      required:true
    }],

    passengers: {
      type: Number,
      required: true,
      min: 1,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    bookingStatus: {
      type: String,
      enum: ["Upcoming", "Completed"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("bookingDetails", BookingModel);


