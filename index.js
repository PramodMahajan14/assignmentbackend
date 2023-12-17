const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;
app.use(express.json());
const path = require("path");
require("./DB/connection");
const cors = require("cors");

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://todo-app.onrender.com"],
  })
);
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "/static"));
  res.send(`<h1 style="text-align:center">To DO APP</h1>`);
});
app.use("/v1/api", require("./Routes/Taskmanag"));

app.listen(PORT, () => {
  console.log("Running server on PORT ", PORT);
});
