const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({
    location: "API home",
    text: "hello",
  });
});

module.exports = app;
