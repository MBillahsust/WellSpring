const express = require("express");

const assesmentController = require("../controller/assesmentController");


const isLogin = require("../middlewares/middlewares");


const assessmentRouter = express.Router();



// Assessment
assessmentRouter.post("/assessments", isLogin, assesmentController.store);
assessmentRouter.delete("/assessments/:id", isLogin, assesmentController.remove);
assessmentRouter.get("/getassessments", isLogin, assesmentController.getAssessments);





module.exports = assessmentRouter;

