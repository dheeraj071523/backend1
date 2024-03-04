require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/dheeraj", (req, res) => {
  res.send("hi dheeraj");
});

app.get("/deepesh", (req, res) => {
  res.send("hi deepesh");
});

app.get("/yogesh", (req, res) => {
  res.send("<h1>hi  yogesh</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`);
});
