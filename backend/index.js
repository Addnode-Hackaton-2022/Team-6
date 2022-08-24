const express = require("express");
const app = express();

// db data
const boats = ["http://localhost:3000/", "http://172.16.67.71/"];

// api
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/hej", (req, res) => {
  res.send("I will be shown on the Browser");
  console.log("I will be shown on the Terminal");
});

app.listen(3001);
