const express = require("express");
const ResearchController = require("../controller/researchController");

const researchRouter = express.Router();

researchRouter.post("/research", ResearchController.submitResearch);

module.exports = researchRouter;
