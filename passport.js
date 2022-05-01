const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/userModel");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "id",
        passwordField: "pw",
        session: true,
        passReqToCallback: false, // true로 하면 다음 콜백함수 parameter에 첫 번째 인자로 req를 통해 body.req를 받을 수 있음
      },
      (id, password, done) => {
        User.findOne({ id }, (findError, user) => {
          if (findError) return done(findError);
          if (!user)
            return done(null, false, { message: "The ID does not exist" });
          return user.comparePassword(
            user.salt,
            password,
            (passwordError, isMatch) => {
              if (isMatch) {
                return done(null, user, { message: "Success" });
              }
              return done(null, false, { message: `${passwordError}` });
            }
          );
        });
      }
    )
  );
};
