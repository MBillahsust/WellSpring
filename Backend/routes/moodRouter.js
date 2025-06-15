const express = require("express");
const moodAndActivityController = require("../controller/moodAndActivityController");
const isLogin = require("../middlewares/middlewares");

const moodRouter = express.Router();

moodRouter.post("/addmood", isLogin, moodAndActivityController.addMood);
moodRouter.delete("/delmood/:id", isLogin, moodAndActivityController.deleteMoodById);
moodRouter.get("/getMood", isLogin, moodAndActivityController.getMoodByUser);

module.exports = moodRouter;
