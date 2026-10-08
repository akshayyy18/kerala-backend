const express = require("express");
// const { createBoat, getBoat, updataBoat, deleteBoat, singleBoat } = require("../controller/boatData")
const authMiddleware = require("../controller/AuthMiddleware");
const permissionMiddleware = require("../controller/permissionMiddleware");
const {
  createBoat,
  getBoat,
  updataBoat,
  deleteBoat,
  singleBoat,
  getCustomeerBoats,
  getSingleBoat,
} = require("../controller/boatData");
// const { authorization } = require("../controller/auth")
// const { authorize } = require("../controller/authorize")
// const authMiddleware = require("../controller/AuthMiddleware")
// // const adminMiddleware = require("../controller/adminMiddleware")
// const { getBoats, updateBoats, deleteBoats, sigleBoat } = require("../controller/boatController")

const boatRoute = express.Router();

// boatRoute.post("/boatData",authorization,authorize("admin"),createBoat)
// boatRoute.post("/createBoat", authMiddleware,createBoat)
// boatRoute.get("/getBoat",getBoat)
// boatRoute.get("/getBoats",authMiddleware, getBoats)
// boatRoute.put("/updateBoat/:id",authorization,authorize("admin"),updataBoat)
// boatRoute.put("/updateBoats/:id",authMiddleware,updateBoats )
// boatRoute.delete("/deleteBoat/:id",authorization,authorize("admin"),deleteBoat)
// boatRoute.delete("/deleteBoats/:id",authMiddleware,deleteBoats)
// boatRoute.get("/single/:id",singleBoat)
// boatRoute.get("/singleBoat/:id", authMiddleware,sigleBoat)

boatRoute.post(
  "/boatData",
  authMiddleware,
  permissionMiddleware("createBoat"),
  createBoat,
);
boatRoute.get(
  "/getBoat",
  authMiddleware,
  permissionMiddleware("viewBoats"),
  getBoat,
);
boatRoute.put(
  "/updataBoat/:id",
  authMiddleware,
  permissionMiddleware("updateBoat"),
  updataBoat,
);
boatRoute.delete(
  "/deleteBoat/:id",
  authMiddleware,
  permissionMiddleware("deleteBoat"),
  deleteBoat,
);
boatRoute.get(
  "/singleBoat/:id",
  authMiddleware,
  permissionMiddleware("viewBoats"),
  singleBoat,
);

boatRoute.get("/boats/customer", getCustomeerBoats);
boatRoute.get("/getSingle/:id", getSingleBoat);

module.exports = boatRoute;
