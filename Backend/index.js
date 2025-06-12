require('dotenv').config(); 

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");  // import your db connection function
const Router = require("./routes/router");

const app = express();


connectDB()
  .then(() => {
    app.use(cors());
    app.use(bodyParser.json());

    app.use("/auth", Router);
    app.use("/research", Router);
    app.use("/addassesment", Router);
    app.use("/mood", Router);
    app.use("/activity", Router);
    app.use("/game", Router);
    app.use("/doctor", Router);
    app.use("/counselor", Router);

    const PORT = process.env.PORT || 5004;
    app.listen(PORT, () => {

      

      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
