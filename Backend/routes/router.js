const express = require("express");
const Controller = require("../controller/userController");

const isLogin = require("../middlewares/middlewares");


const Router = express.Router();


// Authenication
Router.post("/SignUp", Controller.SignUp);
Router.post("/Login", Controller.Login)
Router.get("/User", isLogin, Controller.getUserInfo);



module.exports = Router;
