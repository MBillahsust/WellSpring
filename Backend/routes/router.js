const express = require("express");
const Controller = require("../controller/userController");
const ResearchController = require("../controller/researchController")
const assesmentController = require("../controller/assesmentController");
const moodAndActivityController = require("../controller/moodAndActivityController");
const gameController = require("../controller/gameController");
const doctorController = require("../controller/doctorController");

const isLogin = require("../middlewares/middlewares");


const Router = express.Router();


// Authenication
Router.post("/SignUp", Controller.SignUp);
Router.post("/Login", Controller.Login)
Router.get("/User", isLogin, Controller.getUserInfo);




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

// Add new route for last 10 activities pie chart
Router.get("/activity/last10pie", isLogin, moodAndActivityController.getLast10ActivitiesPie);





// Research
Router.post("/research", ResearchController.submitResearch)





// Game 
Router.post("/gameScore", isLogin, gameController.updateAndGetGameScores);
Router.get("/gameRank/:game_name", isLogin, gameController.getPlayerRank);
Router.post("/gameassessment", isLogin, gameController.postGameAssessment);
Router.get("/gameassessmentData", isLogin, gameController.getAllGameAssessments);



// Doctor
Router.post("/addDoctor", isLogin, doctorController.createDoctor);
Router.get("/getallDoctor", doctorController.getAllDoctors);
Router.post("/recommandDoctor", isLogin, doctorController.recommendDoctorsController);



module.exports = Router;
