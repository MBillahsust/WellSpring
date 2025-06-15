const express = require("express");
const CommunityController = require("../controller/CommunityController");
const isLogin = require("../middlewares/middlewares");

const communityRouter = express.Router();

communityRouter.post("/feedback", isLogin, CommunityController.submitPlatformFeedback);
communityRouter.get("/allfeedback", CommunityController.getAllPlatformFeedback);

module.exports = communityRouter;
