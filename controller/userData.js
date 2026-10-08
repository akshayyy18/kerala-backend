const dataBase = require("../model/userData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = "vgfuvnkjdxv";

exports.signup = async (req, res) => {
  try {
    const { name, email, mobileNumber, password, role,confirmPassword } = req.body;

    const existUser = await dataBase.findOne({ email });
    if (existUser) {
      return res.status(404).json({ message: "email is already exists" });
    }

    if(password !== confirmPassword){
      return res.status(404).json({message:"password is not matching"})
    }

    const mobile = await dataBase.findOne({ mobileNumber });

    if (mobile) {
      return res
        .status(404)
        .json({ message: "mobile number is already exists" });
    }
    if (!name || !email || !mobileNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bcryptPassword = await bcrypt.hash(password, 10);
    const data = await dataBase.create({
      name,
      email,
      mobileNumber,
      password: bcryptPassword,
      role: role || "customer",
    });

    res.status(201).json({ message: "successfully created", data });
  } catch (error) {
    res.status(500).json({ message: "signup failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const data = await dataBase.findOne({ email });
    // console.log(data);

    if (!data) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const comparePassword = await bcrypt.compare(password, data.password);
    // console.log(comparePassword);

    if (!comparePassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: data._id, email: data.email, name: data.name, role: data.role },
      secretKey,
      {
        expiresIn: "1d",
      },
    );
    res.status(200).json({ message: "login successful", token, data });
  } catch (error) {
    res.status(500).json({ message: "login failed", error: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await dataBase.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log("Profile error:", error);

    return res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await dataBase.find({ role: "customer" });

    return res
      .status(200)
      .json({ message: "fetched customers successfully", data: customers });
  } catch (error) {
    return res.status(500).json({message:"failed to fetch" , error: error.message})
  }
};

exports.getAllCustomersData = async(req,res)=>{
  try{
    const customers = await dataBase.find()

     return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
    
  }catch(error){
    return res.status(500).json({message:"failed to fetch" , error: error.message})
  }
}
