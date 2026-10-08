const mongoose = require("mongoose");

const boatSchema = new mongoose.Schema(
  {
    boatName: {
      type: String,
      required: true,
      trim: true,
    },

    boatType: {
      type: String,
      required: true,
      enum: [
        "Houseboat",
        "Shikara",
        "Motor Boat",
        "Speed Boat",
        "Luxury Boat",
        "Cruise Boat",
        "Country Boat",
      ],
    },

    category: {
      type: String,
      required: true,
      enum: ["Standard", "Premium", "Luxury"],
    },

    facility: {
      type: String,
      required: true,
      enum: ["AC", "Non-AC"],
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Available", "Booked", "Maintenance"],
      default: "Available",
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Admin",
      required:true
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Boat", boatSchema);
