const jwt = require("jsonwebtoken");

const secretKey = "vgfuvnkjdxv";

exports.adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Admin token not found",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin token not found",
      });
    }

    const verify = jwt.verify(token, secretKey);

    if (verify.role !== "admin" && verify.role !== "superAdmin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only",
      });
    }

    req.user = verify;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin token",
    });
  }
};


