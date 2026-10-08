const express = require("express");
const {
  createAdmin,
  adminLogin,
  createNormalAdmin,
  normalAdminLogin,
  getNormalAdmin,
  updateNormalAdminPermissions,
  // getSuperAdminProfile,
  getAdminProfile,
  // getSuperAdminProfile,
} = require("../controller/adminController");
const authMiddleware = require("../controller/AuthMiddleware");
const permissionMiddleware = require("../controller/permissionMiddleware");
const { getAllCustomersData } = require("../controller/userData");
const {
  getCustomers,
  getSingleCustomers,
  deleteCustomerData,
  getCustomerBookingHistory,
} = require("../controller/customerController");
// const { loginNormalAdmin } = require("../controller/NormalAdminController")
// const { login, adminRegister, getAdminProfile } = require("../controller/adminController")
// const { adminAuth } = require("../controller/adminAuth")
// const { getAllCustomers } = require("../controller/userData")

const AdminData = express.Router();

// AdminData.post("/admin/register",adminRegister)
// AdminData.post("/admin/login", login)
// AdminData.get("/admin/profile",adminAuth,getAdminProfile)
// AdminData.get("/admin/customer", getAllCustomers)
// /getSingle/6a9e5481768a1155bea01257

AdminData.post("/admin/create-admin", createAdmin);
AdminData.post("/admin/login-admin", adminLogin);
AdminData.post(
  "/admin/create-normal-admin",
  authMiddleware,
  permissionMiddleware("manageAdmins"),
  createNormalAdmin,
);
AdminData.post("/admin/login-normal-admin", normalAdminLogin);

AdminData.get(
  "/admin/normal-admins",
  authMiddleware,
  permissionMiddleware("manageAdmins"),
  getNormalAdmin,
);

AdminData.put(
  "/admin/normal-admin/:id/permissions",
  authMiddleware,
  permissionMiddleware("manageAdmins"),
  updateNormalAdminPermissions,
);

AdminData.get(
  "/admin/getAllCustomers",
  authMiddleware,
  permissionMiddleware("manageCustomers"),
  getAllCustomersData,
);

AdminData.get(
  "/adminSingleCustomers/:id",
  authMiddleware,
  permissionMiddleware("manageCustomers"),
  getSingleCustomers,
);

AdminData.get(
  "/admin/superAdminProfile",
  authMiddleware,
  permissionMiddleware("manageCustomers"),
  getCustomers,
);

AdminData.get(
  "/admin/getBookings/:id",
  authMiddleware,
  permissionMiddleware("viewBookings"),
  getCustomerBookingHistory,
);

AdminData.delete(
  "/admin/deleteCustomer/:id",
  authMiddleware,
  permissionMiddleware("manageCustomers"),
  deleteCustomerData,
);
AdminData.get("/admin/AdminProfile", authMiddleware, getAdminProfile);
module.exports = AdminData;
