const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connection sucessfully");
  })
  .catch((err) => console.log("connection faild : "));
