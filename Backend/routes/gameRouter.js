const express = require("express");
const gameController = require("../controller/gameController");
const isLogin = require("../middlewares/middlewares");

const gameRouter = express.Router();

gameRouter.post("/gameScore", isLogin, gameController.updateAndGetGameScores);
gameRouter.get("/gameRank/:game_name", isLogin, gameController.getPlayerRank);
gameRouter.post("/gameassessment", isLogin, gameController.postGameAssessment);
gameRouter.get("/gameassessmentData", isLogin, gameController.getAllGameAssessments);

module.exports = gameRouter;
