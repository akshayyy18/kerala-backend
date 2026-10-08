const Boat = require("../model/boat");
const Customer = require("../model/userData");
const Booking = require("../model/customerBookingModel");
const boat = require("../model/boat");

exports.getCustomers = async (req, res) => {
  try {
    let customers;

    if (req.admin.role.name === "superAdmin") {
      customers = await Customer.find();
    } else {
      const boats = await Boat.find({
        createdBy: req.user.id,
      }).select("_id");

      const boatIds = boats.map((boat) => boat._id);

      const bookings = await Booking.find({
        boatId: { $in: boatIds },
      }).select("customerId");

      const customerIds = [
        ...new Set(bookings.map((booking) => booking.customerId.toString())),
      ];

      customers = await Customer.find({
        _id: { $in: customerIds },
      });
    }

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.log("Get Customers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch details",
      error: error.message,
    });
  }
};

exports.getSingleCustomers = async (req, res) => {
  try {
    const { id } = req.params;

    let customers;

    if (req.admin.role.name === "superAdmin") {
      customers = await Customer.findById(id);
    } else {
      const boats = await boat.find({
        createdBy: req.user.id,
      });

      const boatIds = boats.map((boat) => boat._id);

      const bookings = await Booking.findOne({
        customerId: id,
        boatId: { $in: boatIds },
      });

      if (bookings) {
        customers = await Customer.findById(id);
      }

      if (!customers) {
        return res.status(404).json({
          success: false,
          message: "Customer not found or you are not authorized",
        });
      }
    }
    return res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch details",
      error: error.message,
    });
  }
};

exports.getCustomerBookingHistory = async (req, res) => {
  try {
    const { id } = req.params; // customer ID
        console.log("Customer ID received:", id);


    let bookings;

    // Super Admin
    if (req.admin.role.name === "superAdmin") {
      bookings = await Booking.find({
        customerId: id,
      })
        .populate(
          "boatId",
          "boatName boatType category price location destination createdBy"
        )
        .populate(
          "customerId",
          "name email mobileNumber"
        )
        .sort({ createdAt: -1 });
    }
    

    // Normal Admin
    else {
      const boats = await Boat.find({
        createdBy: req.user.id,
      }).select("_id");

      const boatIds = boats.map((boat) => boat._id);

      bookings = await Booking.find({
        customerId: id,
        boatId: { $in: boatIds },
      })
      
        .populate(
          "boatId",
          "boatName boatType category price location destination"
        )
        .populate(
          "customerId",
          "name email mobileNumber"
        )
        .sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log("Customer Booking History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customer booking history",
      error: error.message,
    });
  }
};

exports.deleteCustomerData = async (req, res) => {
  try {
    const{id} = req.params

    if(req.admin.role.name === "superAdmin"){
      const customer = await Customer.findByIdAndDelete(id)

      if(!customer){
        return res.status(404).json({message:"customer not found"})
      }
    }

    else{
      const boats = await Boat.find({
        createdBy:req.user.id
      })

      const boatIds = boats.map((boat)=> boat._id)

      const booking = await Booking.findOne({
        customerId : id,
        boatId : {$in : boatIds}
      })

      if (!booking) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this customer",
      });
    }
    const customer = await Customer.findByIdAndDelete(id)

    if(!customer){
      return res.status(404).json({message:"customer not found"})
    }
    }

    return res.status(200).json({message:"Customer Deleted Successfully"})
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to delete", error: error.message });
  }
};
