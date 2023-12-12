const express = require("express");
const app = express();
const port = 8000;
const Routes = require("./routes/routes");
const connection = require("./database/db");
const cors = require("cors");
const bodyParser = require("body-parser");


app.use(express.json());

app.use(cors());

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", Routes);

connection();

app.listen(port, () => {
  console.log("Server is running", port);
});
