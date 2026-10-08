const NormalAdmin = require("../model/normalAdminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const secretKey = "dfgyuhijxcvbnyutxchvjbkn"
const secretKey = "vgfuvnkjdxv";

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return res.status(404).json({ message: "all filelds are required" });
    }

    const existingmail = await NormalAdmin.findOne({ email });
    if (existingmail) {
      return res.status(400).json({
        message: "Normal Admin already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const normalUser = await NormalAdmin.create({
      name,
      email,
      password: hashPassword,
      role: "normalAdmin",
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Normal Admin created successfully",
      data: {
        id: normalUser._id,
        name: normalUser.name,
        email: normalUser.email,
        role: normalUser.role,
        createdby: normalUser.createdby,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginNormalAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalAdmins = await NormalAdmin.findOne({
      email,
    });

    if (!normalAdmins) {
      return res.status(404).json({
        message: "Normal Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, normalAdmins.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: normalAdmins._id,
        role: "normalAdmin",
      },
      secretKey,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Normal Admin login successful",
      token,
      id: normalAdmins._id,
      name: normalAdmins.name,
      role: normalAdmins.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNormalProfile = async (req, res) => {
  try {
    const normalAdmin = await NormalAdmin.findById(req.user.id);

    if (!normalAdmin) {
      return res.status(404).json({
        message: "Normal Admin not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      data: normalAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
