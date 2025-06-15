const express = require("express");
const moodAndActivityController = require("../controller/moodAndActivityController");
const isLogin = require("../middlewares/middlewares");

const activityRouter = express.Router();

activityRouter.post("/addactivity", isLogin, moodAndActivityController.addActivity);
activityRouter.delete("/delactivity/:id", isLogin, moodAndActivityController.deleteActivityById);
activityRouter.get("/getActivity", isLogin, moodAndActivityController.getActivityByUser);

// Add new route for last 10 activities pie chart
activityRouter.get("/activity/last10pie", isLogin, moodAndActivityController.getLast10ActivitiesPie);




module.exports = activityRouter;
