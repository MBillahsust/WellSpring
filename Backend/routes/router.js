const express = require("express");
const Controller = require("../controller/userController");
const ResearchController = require("../controller/researchController")


const Router = express.Router();





Router.post("/SignUp", Controller.SignUp);
Router.post("/Login", Controller.Login)
Router.post("/research", ResearchController.submitResearch)







module.exports = Router;
