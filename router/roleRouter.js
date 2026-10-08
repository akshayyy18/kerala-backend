const express = require("express");

const {
  createRoles
} = require("../controller/roleController");

const roleRouter = express.Router();


roleRouter.post(
  "/create-roles",
  createRoles
);


module.exports = roleRouter;