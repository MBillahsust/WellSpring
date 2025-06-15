const express = require("express");
const AiCounselorController = require("../controller/AiCounselorController");
const isLogin = require("../middlewares/middlewares");

const aiCounselorRouter = express.Router();

aiCounselorRouter.post("/context", isLogin, AiCounselorController.getUserContextController);

module.exports = aiCounselorRouter;
