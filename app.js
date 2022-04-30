const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { default: helmet } = require("helmet");

const Data = require("./models/dataModel");

const testData = {
  location: "PKNU CAPSTONE DESIGN API",
  sound: 200,
  vibration: 300,
  updated: new Date(),
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
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get("/", (req, res) => {
  res.json("homepage");
});

app.get("/api/test", (req, res) => {
  res.json(testData);
});

app.get("/api/data", (req, res) => {
  const date = req.query.date;
  const location = req.query.location;

  Data.find({
    date: date || { $exists: true },
    location: location || { $exists: true },
  })
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
    });
});

app.post("/api/data", (req, res) => {
  console.log(req.body);
  if (req.body != undefined) {
    if (req.body.auth === process.env.AUTH_KEY) {
      const location = req.body.location;
      const sound = req.body.sound;
      const vibration = req.body.vibration;
      const updated = new Date();
      const newData = new Data({ location, sound, vibration, updated });

      newData
        .save()
        .then(() => {
          console.log("Upload OK");
          res.status(200).json({
            status: "OK",
            data: req.body,
          });
        })
        .catch((err) => {
          console.error("DB error");
          res.status(400).json(err);
        });
    } else {
      res.status(403);
      res.json({
        status: "INCORRECT AUTH",
      });
    }
  } else {
    console.error("empty body");
    res.status(400);
    res.json({
      status: "BAD REQUEST",
    });
  }
});

app.delete("/api/data/:id", (req, res) => {
  // Data.deleteMany({ _id: { $in: req.body.idArr } })
  Data.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

module.exports = app;
