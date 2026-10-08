const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    permissions: [
      {
        type: String,
        enum: [
          "manageAdmins",
          "manageCustomers",
          "viewBoats",
          "createBoat",
          "updateBoat",
          "deleteBoat",
          "viewBookings",
          "manageBookings",
        ],
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Admin", adminSchema);
