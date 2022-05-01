const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport");
const { default: helmet } = require("helmet");
const Data = require("./models/dataModel");
const User = require("./models/userModel");
const { encrypt } = require("./crypto");

const testData = {
  location: "PKNU CAPSTONE DESIGN API",
  sound: 200,
  vibration: 300,
  updated: new Date(),
};

dotenv.config();
const app = express();

// MongoDB
try {
  mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
  mongoose.connection.once("open", () => {
    console.log("MongoDB is Connected");
  });
} catch (error) {
  console.error("mongoDB error");
  console.log(error);
}

// Express JS
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport JS
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

// Development vs Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
} else {
  app.use(cors());
}

// Routing
app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(
      this.path.resolve(__dirname, "./client", "build", "index.html")
    );
  } else {
    res.json("homepage");
  }
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      next(err);
    }
    if (user) {
      req.logIn(user, (err) => {
        if (err) {
          next(err);
        } else {
          if (info.message === "Success") {
            res.json({
              info: info.message,
              user,
            });
          } else {
            res.json({
              info: info.message,
            });
          }
        }
      });
    } else {
      res.send(info.message);
    }
  })(req, res, next);
});

app.post("/admin", async (req, res) => {
  const pw = await encrypt("PKNUHSW201712214");
  console.log(pw);
  const newID = new User({
    id: "HSW",
    key: pw.key,
    salt: pw.salt,
    nickname: "HSW",
    updated: new Date(),
    created: new Date(),
    securityLevel: 0,
  });
  newID
    .save()
    .then(() => {
      console.log("ID Created");
      res.json(newID);
    })
    .catch((err) => {
      console.error(err);
      res.json(err);
    });
});

// API Request
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
