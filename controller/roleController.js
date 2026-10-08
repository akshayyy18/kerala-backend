const Role = require("../model/roleData");

exports.createRoles = async (req, res) => {
  try {

    let superAdmin = await Role.findOne({
      name: "superAdmin"
    });

    if (!superAdmin) {
      superAdmin = await Role.create({
        name: "superAdmin"
      });
    }


    let normalAdmin = await Role.findOne({
      name: "normalAdmin"
    });

    if (!normalAdmin) {
      normalAdmin = await Role.create({
        name: "normalAdmin"
      });
    }


    return res.status(201).json({
      message: "Roles created successfully",
      data: {
        superAdmin,
        normalAdmin
      }
    });

  } catch (error) {

    return res.status(500).json({
      message: "Failed to create roles",
      error: error.message
    });

  }
};