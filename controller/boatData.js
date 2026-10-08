const dataBase = require("../model/boat");

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

    return res.status(200).json({ message: "Data Created", data: boat });
  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      message: "not created",
      error: error.message,
    });
  }
};

exports.getBoat = async (req, res) => {
  try {
    let boats;

    // Super Admin → all boats
    if (req.admin.role.name === "superAdmin") {
      boats = await dataBase.find()
      .populate("createdBy", "name");
    }

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
    console.error("Get boats error:", error);

    return res.status(500).json({
      message: "Failed to fetch boats",
      error: error.message,
    });
  }
};

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
        },
      );
    } else {
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
        },
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
    console.error("Update Boat Error:", error);

    return res.status(500).json({
      message: "Failed to update boat",
      error: error.message,
    });
  }
};

exports.deleteBoat = async (req, res) => {
  try {
    const { id } = req.params;

    let boat;
    if (req.admin.role.name === "superAdmin") {
      boat = await dataBase.findByIdAndDelete(id);
    } else {
      boat = await dataBase.findOneAndDelete({
        _id: id,
        createdBy: req.user.id,
      });
    }
    if (!boat) {
      return res.status(404).json({ message: "boat not found" });
    }
    await dataBase.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted Successful", data: boat });
  } catch (error) {
    console.error("Get boats error:", error);

    return res.status(500).json({
      message: "Failed to fetch boats",
      error: error.message,
    });
  }
};

exports.singleBoat = async (req, res) => {
  try {
    const { id } = req.params;

    let boat;

    if (req.admin.role.name === "superAdmin") {
      boat = await dataBase.findById(id);
    } else {
      boat = await dataBase.findOne({
        _id: id,
        createdBy: req.user.id,
      });
    }

    if (!boat) {
      return res.status(404).json({
        message: "Boat not found",
      });
    }
    return res.status(200).json({
      message: "Boat fetched successfully",
      data: boat,
    });
  } catch (error) {
    console.error("Get boats error:", error);

    return res.status(500).json({
      message: "Failed to fetch boats",
      error: error.message,
    });
  }
};


exports.getCustomeerBoats = async(req,res)=>{
  try{

    const boats = await dataBase.find()
     if (boats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No boats found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All boats fetched successfully",
      count: boats.length,
      data: boats,
    });

  }catch(error){
    return res.status(500).json({
      message: "Failed to fetch boats",
      error: error.message,
    });
  }
}


exports.getSingleBoat = async(req,res)=>{
  try{
    const{id} = req.params

    const boat = await dataBase.findById(id)

     if (!boat) {
      return res.status(404).json({
        success: false,
        message: "Boat not found",
      });
    }

       return res.status(200).json({
      success: true,
      message: "boat fetched successfully",
      data: boat,
    });
  }catch(error){
     return res.status(500).json({
      message: "Failed to fetch boats",
      error: error.message,
    });
  }
}
