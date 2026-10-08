const mongoose = require("mongoose");

const seatModel = new mongoose.Schema(
  {
    boatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boat",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },
    row: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timeStamps: true },
);

module.exports = mongoose.model("Seat", seatModel);
