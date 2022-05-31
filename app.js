const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport");
const { default: helmet } = require("helmet");
const { encrypt, decrypt } = require("./crypto");
const Data = require("./models/dataModel");
const User = require("./models/userModel");
const History = require("./models/historyModel");
const moment = require("moment");
const odata = require("./odata");

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
  app.use(
    cors({
      origin: "http://localhost:5000",
      credentials: true,
    })
  );
}

// Authenticate
app.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.send(false);
  }
});

// Middleware
const checkLogin = (req, res, next) => {
  if (req.isAuthenticated() === true) {
    next();
  } else {
    res.send("Need Login");
  }
};

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

app.get("/logout", checkLogin, (req, res) => {
  req.logout();
  req.session.save(() => {
    res.send("Logout");
  });
});

app.post("/signup", async (req, res) => {
  const id = req.body.id;
  const pw = await encrypt(req.body.pw);
  const nickname = req.body.nickname;
  const signUpKey = req.body.inputKey;

  const newID = new User({
    id,
    key: pw.key,
    salt: pw.salt,
    nickname,
    updated: new Date(),
    created: new Date(),
    securityLevel: 1,
  });

  if ((await User.findOne({ id })) !== null) {
    res.json({
      info: "ID is already exist",
    });
  } else if ((await User.findOne({ nickname })) !== null) {
    res.json({
      info: "Same Nickname is already exist",
    });
  } else {
    if (signUpKey === process.env.SIGNUP_KEY) {
      newID
        .save()
        .then(() => {
          console.log("ID Created");
          res.json({
            info: "Success",
            newID,
          });
        })
        .catch((err) => {
          console.error(err);
          res.json(err);
        });
    } else {
      res.json({ info: "Incorrect Auth Key" });
    }
  }
});

app.get("/history", checkLogin, async (req, res) => {
  const history = await History.find().sort({
    year: "desc",
    month: "desc",
    date: "desc",
    updated: "desc",
  });
  res.json(history);
});
app.post("/history", checkLogin, (req, res) => {
  const content = req.body.content;
  const year = req.body.year;
  const month = req.body.month;
  const date = req.body.date;

  const history = new History({
    content,
    year,
    month,
    date,
    updated: new Date(),
  });

  history
    .save()
    .then(() => {
      console.log("history updated");
      res.json("history updated");
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/nickname/:id", checkLogin, (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((result) => {
      res.status(200).json(result.nickname);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
app.post("/nickname", checkLogin, (req, res) => {
  const nickname = req.body.nickname;
  const id = req.body.id;

  User.findByIdAndUpdate(id, { nickname })
    .then(() => {
      res.status(200).send("UPDATED");
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/image/:id", checkLogin, (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .then((result) => {
      res.status(200).json(result.image);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
app.post("/image", checkLogin, (req, res) => {
  const image = req.body.image;
  const id = req.body.id;

  User.findByIdAndUpdate(id, { image })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.post("/password", checkLogin, async (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  const newPassword = req.body.newPW;

  try {
    const user = await User.findById(id);
    const key = await decrypt(user.salt, password);
    if (user.key === key) {
      const newPW = await encrypt(newPassword);
      User.findByIdAndUpdate(id, { key: newPW.key, salt: newPW.salt })
        .then(() => {
          res.status(200).json({
            original: {
              key: user.key,
              salt: user.salt,
            },
            updated: {
              key: newPW.key,
              salt: newPW.salt,
            },
          });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    } else {
      res.status(200).send("incorrect");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// API Request
app.get("/api/data", checkLogin, (req, res) => {
  Data.find(odata(req.query).filter)
    .sort(odata(req.query).orderby)
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
    });
});

app.post("/api/data", async (req, res) => {
  if (req.body != undefined) {
    if (req.body.auth === process.env.AUTH_KEY) {
      const location = parseInt(req.body.location);
      const sound = parseInt(req.body.sound);
      const vibration = parseInt(req.body.vibration);
      const updated = new Date();
      const newData = new Data({ location, sound, vibration, updated });

      const duplicateData = await Data.findOne({
        location,
        updated: {
          $gte: new Date(moment(updated).startOf("minute")),
          $lt: new Date(moment(updated).startOf("minute").add(1, "m")),
        },
      });

      // Check duplicate data
      if (duplicateData !== null) {
        await Data.findByIdAndUpdate(duplicateData._id, {
          sound: (parseInt(duplicateData.sound) + sound) / 2,
          vibration: (parseInt(duplicateData.vibration) + vibration) / 2,
          updated,
        });
        console.log("Update OK");
      } else {
        await newData
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
      }

      // Find Noise Source
      const tempArr = await Data.find({
        updated: {
          $gte: new Date(moment(updated).startOf("minute")),
          $lt: new Date(moment(updated).startOf("minute").add(1, "m")),
        },
      });
      tempArr.sort((a, b) => b.sound - a.sound);

      await Data.findByIdAndUpdate(tempArr[0]._id, {
        getSound: 0,
        postSound: tempArr[0].sound,
      });

      tempArr.forEach(async (element, index, arr) => {
        if (index > 0) {
          await Data.findByIdAndUpdate(element._id, {
            getSound: arr[0].sound * 0.5, // 0.5 => Noise attenuation factor
            postSound: element.sound - arr[0].sound * 0.5,
          });
        }
      });

      // Incorrect auth
    } else {
      console.log("Incorrect auth");
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

app.delete("/api/data/:id", checkLogin, (req, res) => {
  // Data.deleteMany({ _id: { $in: req.body.idArr } })
  Data.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
});

module.exports = app;
