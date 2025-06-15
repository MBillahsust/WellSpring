require('dotenv').config(); 

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");  


const Router = require("./routes/router");
const assessmentRouter = require("./routes/assessment")
const moodRouter = require("./routes/moodRouter")
const activityRouter = require("./routes/activityRouter")
const gameRouter = require("./routes/gameRouter")
const researchRouter = require("./routes/researchRouter")
const doctorRouter = require("./routes/doctorRouter")
const aiRouter = require("./routes/aiRouter")
const communityRouter = require("./routes/comminityRouter")

const app = express();


connectDB()
  .then(() => {
    app.use(cors());
    app.use(bodyParser.json());

    app.use("/auth", Router);
    app.use("/research", researchRouter);
    app.use("/addassesment", assessmentRouter);
    app.use("/mood", moodRouter);
    app.use("/activity", activityRouter);
    app.use("/game", gameRouter);
    app.use("/doctor", doctorRouter);
    app.use("/counselor", aiRouter);
    app.use("/community", communityRouter);

    const PORT = process.env.PORT || 5004;
    app.listen(PORT, () => {

      

      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
