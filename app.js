const express = require("express");
const { default: helmet } = require("helmet");

const app = express();

const homeData = {
  time: new Date().toString(),
  data: "PKNU CAPSTONE DESIGN API",
};
const tempData = {
  time: new Date().toString(),
  data: {
    sound: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    vibration: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
};

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json(homeData);
});

app.get("/data", (req, res) => {
  res.json(tempData);
});

app.post("/data", (req, res) => {
  console.log(req.body);
  if (req.body != undefined) {
    res.status(200);
    res.json(req.body);
  } else {
    res.status(400);
  }
});

module.exports = app;
