const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const url = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.phoda.mongodb.net/${process.env.DATA_BASE}?retryWrites=true&w=majority`;
const todoHandler = require("./routeHandler/todoHandler");

const app = express();
app.use(express.json());

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

app.use("/todos", todoHandler);

function errorHandler(err, req, res, next) {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
}

app.listen(5000, () => {
  console.log("listening to port 5000");
});
