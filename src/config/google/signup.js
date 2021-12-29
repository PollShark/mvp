const Strategy = require("passport-local").Strategy;
const User = require("../../models/user");

const SignupStrategy = new Strategy(
  {
    passReqToCallback: true,
    usernameField: "email",
    passwordField: "googleId",
  },
  function (req, email, password, done) {
    User.findOne({ email: req.body.email })
      .lean()
      .exec(async (err, user) => {
        if (err) {
          return done(err, null);
        }

        if (!user) {
          const user = new User({
            googleId: req.body.googleId,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
          })
          await user.save();
          // const user = await User.create();
          return done(null, user);
        }
        if (user) {
          return done("Account already exists.Please login!", null);
        }
      });
  }
);

module.exports = SignupStrategy;
