const express = require("express");
const Controller = require("../controller/userController");
const ResearchController = require("../controller/researchController")
const assesmentController = require("../controller/assesmentController");
const moodAndActivityController = require("../controller/moodAndActivityController");
const isLogin = require("../middlewares/middlewares");


const Router = express.Router();

Router.post("/SignUp", Controller.SignUp);
Router.post("/Login", Controller.Login)
Router.post("/research", ResearchController.submitResearch)


// Assessment
Router.post("/assessments", isLogin, assesmentController.store);
Router.delete("/assessments/:id", isLogin, assesmentController.remove);
Router.get("/getassessments", isLogin, assesmentController.getAssessments);


// Mood
Router.post("/addmood", isLogin, moodAndActivityController.addMood);
Router.delete("/delmood/:id", isLogin, moodAndActivityController.deleteMoodById);
Router.get("/getMood", isLogin, moodAndActivityController.getMoodByUser);


// Activity
Router.post("/addactivity", isLogin, moodAndActivityController.addActivity);
Router.delete("/delactivity/:id", isLogin, moodAndActivityController.deleteActivityById);
Router.get("/getActivity", isLogin, moodAndActivityController.getActivityByUser);







module.exports = Router;
