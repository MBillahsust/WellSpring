const express = require("express");
const Controller = require("../controller/userController");

const Router = express.Router();





Router.post("/SignUp", Controller.SignUp);
Router.post("/Login", Controller.Login)







module.exports = Router;
