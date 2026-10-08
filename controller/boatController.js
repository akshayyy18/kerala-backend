const dataBase = require("../model/boat");

// CREATE BOAT
exports.createBoat = async (req, res) => {
  try {
    const {
      boatName,
      boatType,
      category,
      facility,
      capacity,
      price,
      location,
      destination,
      description,
      image,
      status,
    } = req.body;

    if (
      !boatName ||
      !boatType ||
      !category ||
      !facility ||
      capacity === undefined ||
      price === undefined ||
      !location ||
      !destination
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const boat = await dataBase.create({
      boatName,
      boatType,
      category,
      facility,
      capacity,
      price,
      location,
      destination,
      description,
      image,
      status: status || "Available",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Boat created successfully",
      data: boat,
    });
  } catch (error) {
    console.log("Create Boat Error:", error);

    return res.status(500).json({
      message: "Failed to create boat",
      error: error.message,
    });
  }
};


// GET BOATS
exports.getBoat = async (req, res) => {
  try {
    let boats;

    // Super Admin → all boats
    if (req.admin.role.name === "superAdmin") {
      boats = await dataBase.find();
    }

    // Normal Admin → only own boats
    else {
      boats = await dataBase.find({
        createdBy: req.user.id,
      });
    }

    if (boats.length === 0) {
      return res.status(404).json({
        message: "No boats found",
      });
    }

    return res.status(200).json({
      message: "Boats fetched successfully",
      count: boats.length,
      data: boats,
    });
  } catch (error) {
    console.log("Get Boat Error:", error);

    return res.status(500).json({
      message: "Failed to fetch boats",
      error: error.message,
    });
  }
};


// UPDATE BOAT
exports.updataBoat = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      boatName,
      boatType,
      category,
      facility,
      capacity,
      price,
      location,
      destination,
      description,
      image,
      status,
    } = req.body;

    let boat;

    // Super Admin → can update any boat
    if (req.admin.role.name === "superAdmin") {
      boat = await dataBase.findByIdAndUpdate(
        id,
        {
          boatName,
          boatType,
          category,
          facility,
          capacity,
          price,
          location,
          destination,
          description,
          image,
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    // Normal Admin → only own boat
    else {
      boat = await dataBase.findOneAndUpdate(
        {
          _id: id,
          createdBy: req.user.id,
        },
        {
          boatName,
          boatType,
          category,
          facility,
          capacity,
          price,
          location,
          destination,
          description,
          image,
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (!boat) {
      return res.status(404).json({
        message: "Boat not found or you are not authorized",
      });
    }

    return res.status(200).json({
      message: "Boat updated successfully",
      data: boat,
    });
  } catch (error) {
    console.log("Update Boat Error:", error);

    return res.status(500).json({
      message: "Failed to update boat",
      error: error.message,
    });
  }
};


// DELETE BOAT
exports.deleteBoat = async (req, res) => {
  try {
    const { id } = req.params;

    let boat;

    // Super Admin → can delete any boat
    if (req.admin.role.name === "superAdmin") {
      boat = await dataBase.findByIdAndDelete(id);
    }

    // Normal Admin → only own boat
    else {
      boat = await dataBase.findOneAndDelete({
        _id: id,
        createdBy: req.user.id,
      });
    }

    if (!boat) {
      return res.status(404).json({
        message: "Boat not found or you are not authorized",
      });
    }

    return res.status(200).json({
      message: "Boat deleted successfully",
      data: boat,
    });
  } catch (error) {
    console.log("Delete Boat Error:", error);

    return res.status(500).json({
      message: "Failed to delete boat",
      error: error.message,
    });
  }
};



exports.singleBoat = async (req, res) => {
  try {
    const { id } = req.params;

    let boat;

    // Super Admin → any boat
    if (req.admin.role.name === "superAdmin") {
      boat = await dataBase.findById(id);
    }

    // Normal Admin → only own boat
    else {
      boat = await dataBase.findOne({
        _id: id,
        createdBy: req.user.id,
      });
    }

    if (!boat) {
      return res.status(404).json({
        message: "Boat not found or you are not authorized",
      });
    }

    return res.status(200).json({
      message: "Boat fetched successfully",
      data: boat,
    });
  } catch (error) {
    console.log("Single Boat Error:", error);

    return res.status(500).json({
      message: "Failed to fetch boat",
      error: error.message,
    });
  }
};