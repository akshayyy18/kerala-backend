const Admin = require("../model/adminData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Role = require("../model/roleData");

const permissions = [
  "manageAdmins",
  "manageCustomers",
  "viewBoats",
  "createBoat",
  "updateBoat",
  "deleteBoat",
  "viewBookings",
  "manageBookings",
];

// ADMIN LOGIN

// const secretKey = "edcfvgbhnhjbhjn";
const secretKey = "vgfuvnkjdxv";
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "password is not matching" });
    }

    const existAdmin = await Admin.findOne({ email });
    if (existAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const supeerAdmin = await Role.findOne({
      name: "superAdmin",
    });

    if (!supeerAdmin) {
      return res.status(404).json({
        message: "superAdmin role not found. Create roles first.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashPassword,
      role: supeerAdmin._id,
      permissions: permissions,
      createdBy: null,
    });

    return res.status(200).json({
      message: "Super Admin Created",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "superAdmin",
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create Super Admin",
      error: error.message,
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({
      email,
    }).populate("role");

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!admin.role) {
      return res.status(403).json({
        message: "Admin role is not assigned",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role.name,
      },
      secretKey,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Login successful",

      token,

      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role.name,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Login",
      error: error.message,
    });
  }
};

exports.createNormalAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      permissions: requestedPermissions,
    } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password is not matching",
      });
    }

    if (!req.admin || req.admin.role.name !== "superAdmin") {
      return res.status(403).json({
        message: "Only Super Admin can create Normal Admin",
      });
    }

    const existingEmail = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const normalAdminRole = await Role.findOne({
      name: "normalAdmin",
    });

    if (!normalAdminRole) {
      return res.status(404).json({
        message: "normalAdmin role not found. Create roles first.",
      });
    }

    let selectedPermissions = [];

    if (Array.isArray(requestedPermissions)) {
      selectedPermissions = requestedPermissions.filter((permission) =>
        permissions.includes(permission),
      );
    }

    selectedPermissions = selectedPermissions.filter(
      (permission) => permission !== "manageAdmins",
    );

    const hashPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      role: normalAdminRole._id,
      permissions: selectedPermissions,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Normal Admin created successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "normalAdmin",
        permissions: admin.permissions,
        createdBy: admin.createdBy,
      },
    });
  } catch (error) {
    console.log("Create Normal Admin Error:", error);

    return res.status(500).json({
      message: "Failed to create Normal Admin",
      error: error.message,
    });
  }
};

exports.normalAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log("Email received:", email);

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    }).populate("role");

    // console.log("Admin found:", admin);

    if (!admin) {
      return res.status(404).json({
        message: "Normal Admin not found",
      });
    }

    if (!admin.role || admin.role.name !== "normalAdmin") {
      return res.status(403).json({
        message: "This account is not a Normal Admin",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role.name,
      },
      secretKey,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Normal Admin login successful",
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role.name,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    console.log("Normal Admin Login Error:", error);

    return res.status(500).json({
      message: "Normal Admin login failed",
      error: error.message,
    });
  }
};

exports.getNormalAdmin = async (req, res) => {
  try {
    const normlaAdmin = await Role.findOne({
      name: "normalAdmin",
    });

    if (!normlaAdmin) {
      return res.status(404).json({
        success: false,
        message: "Normal Admin role not found",
      });
    }

    const admin = await Admin.find({ role: normlaAdmin._id })
      .populate("role", "name")
      .populate("createdBy", "name email");

    return res.status(200).json({
      success: true,
      message: "Normal Admins fetched successfully",
      count: admin.length,
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch details",
      error: error.message,
    });
  }
};

exports.updateNormalAdminPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions: requestedPermissions } = req.body;

    if (!Array.isArray(requestedPermissions)) {
      return res.status(404).json({ message: "out of an Array" });
    }

    let selectedPermissions = requestedPermissions.filter((permission) =>
      permissions.includes(permission),
    );

    selectedPermissions = selectedPermissions.filter(
      (permission) => permission !== "manageAdmins",
    );

    const admin = await Role.findOne({
      name: "normalAdmin",
    });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Normal Admin role not found",
      });
    }

    const normalAdmin = await Admin.findOne({
      _id: id,
      role: admin._id,
    });

    if (!normalAdmin) {
      return res.status(404).json({
        success: false,
        message: "Normal Admin not found",
      });
    }

    normalAdmin.permissions = selectedPermissions;

    await normalAdmin.save();

    return res.status(200).json({
      success: true,
      message: "Normal Admin permissions updated successfully",
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to Update the permissions" });
  }
};

exports.getAdminProfile = async (req, res) => {
  
  try {

    const admin = await Admin.findById(req.user.id).populate("role", "name");

    if (!admin) {
      return res.status(404).json({ message: "Admin Not found" });
    }

    if (admin?.role.name !== "superAdmin") {
      return res
        .status(404)
        .json({ message: "You Don't Have Access to Fetch the Profile" });
    }

    return res.status(200).json({ message: "Fetched the profile", admin });
  } catch (error) {
    return res.status(500).json({ message: "Failed to Fetch the profile" });
  }
};

exports.superAdminProfile = async (req, res) => {
  try {


  } catch (error) {
    return res.status(500).json({ message: "Failed to Fetch the profile" });
  }
};
