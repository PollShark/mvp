var express = require("express");
const auth = require("../middlewares/auth");
const {
  loginUser,
  googleSignIn,
  googleSignUp,
  registerUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/authController");
const User = require("../models/user");
var router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.post("/signin", googleSignIn); //login
router.post("/forget_password", forgetPassword);
router.post("/reset_password", resetPassword);

router.get("/users/:id", auth, async (req, res) => {
  res.send(req.user);
});
router.post("/users/logout", auth, async (req, res) => {
  console.log('LOGOUT API CALLED=====================>>>>>>>>>>>>>>>>');
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    console.log('hiiiiiiiiii');
    res.status(200).send();
  } catch (e) {
    console.log('byrrrrrrrr');
    res.status(500).send();
  }
});
router.get("/", function (req, res) {
  res.send("home page");
});
module.exports = router;

// router.post("/signup", googleSignUp);
