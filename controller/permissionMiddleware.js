const Admin = require("../model/adminData");

const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {

      if (!req.user) {
        return res.status(401).json({
          message: "User not authenticated",
        });
      }

      const admin = await Admin.findById(req.user.id).populate("role");

      if (!admin) {
        return res.status(404).json({
          message: "Admin not found",
        });
      }

      if (!admin.role) {
        return res.status(403).json({
          message: "Admin role is not assigned",
        });
      }

      if (admin.role.name === "superAdmin") {
        req.admin = admin;
        return next();
      }

      if (!admin.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      }

      req.admin = admin;

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Permission check failed",
        error: error.message,
      });
    }
  };
};

module.exports = permissionMiddleware;