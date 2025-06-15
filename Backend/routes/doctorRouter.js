const express = require("express");
const doctorController = require("../controller/doctorController");
const isLogin = require("../middlewares/middlewares");

const doctorRouter = express.Router();

doctorRouter.post("/addDoctor", isLogin, doctorController.createDoctor);
doctorRouter.get("/getallDoctor", doctorController.getAllDoctors);
doctorRouter.post("/recommandDoctor", isLogin, doctorController.recommendDoctorsController);

module.exports = doctorRouter;
