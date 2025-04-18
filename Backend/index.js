const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Router = require("./routes/router");

const app = express();

app.use(cors());
app.use(bodyParser.json());




app.use("/auth", Router);
app.use("/research", Router)









const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
