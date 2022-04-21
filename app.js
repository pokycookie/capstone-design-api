const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { default: helmet } = require("helmet");

const Data = require("./models/dataModel");

const testData = {
  time: new Date().toString(),
  data: {
    contents: "PKNU CAPSTONE DESIGN API",
    status: "200 OK",
  },
};

dotenv.config();
const app = express();

try {
  mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
  mongoose.connection.once("open", () => {
    console.log("MongoDB is Connected");
  });
} catch (error) {
  console.error("mongoDB error");
  console.log(error);
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json("homepage");
});

app.get("/api/test", (req, res) => {
  res.json(testData);
});

app.get("/api/data", async (req, res) => {
  const data = await Data.findOne({});
  res.json(data);
});

app.post("/api/data", (req, res) => {
  console.log(req.body);
  if (req.body != undefined) {
    if (req.body.auth == process.env.AUTH_KEY) {
      const location = req.body.location;
      const sound = req.body.sound;
      const vibration = req.body.vibration;
      const updated = new Date();
      const newData = new Data({ location, sound, vibration, updated });

      newData
        .save()
        .then(() => {
          console.log("OK");
          res.status(200).json({
            status: "OK",
            data: req.body,
          });
        })
        .catch((err) => {
          console.log("ERROR");
          res.status(400).json(err);
        });
    } else {
      console.log("AUTH INCORRECT");
      res.status(403);
      res.json({
        status: "FORBIDDEN",
      });
    }
  } else {
    console.log("no body");
    res.status(400);
    res.json({
      status: "BAD REQUEST",
    });
  }
});

module.exports = app;
