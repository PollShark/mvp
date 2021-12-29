const Strategy = require("passport-local").Strategy;
const User = require("../../models/user");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const LoginStrategy = new Strategy(
  { passReqToCallback: true, usernameField: "email", passwordField: "googleId" },
  async function (req,email, password, done) {
    console.log('req: ', req.body);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        const user = new User({
          googleId: req.body.googleId,
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        })
        const createdUser = await user.save();
        const token = await createdUser.generateAuthToken();
        return done(null, {token,user});
      }
      const isPasswordValid = password === user.googleId;

      if (!isPasswordValid) {
        return done("Google authentication failed", null);
      }
      const token = await user.generateAuthToken();
      return done(null,{
        token,
        user,
      });
    } catch (err) {
      console.log('err: ', err);
      return done(err,null)
    }
  }
);

module.exports = LoginStrategy;
