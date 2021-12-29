const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");

const loginUser = expressAsyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("userExists hola: ");
    const userExists = await User.findOne({ email });
    console.log("userExists: ", userExists);
    if (userExists) {
      if (userExists.password === password) {
        const token = await userExists.generateAuthToken();
        return res.send({
          token,
          user: userExists,
        });
      }
      return res.status(404).send("Password does not match!");
    } else {
      return res.status(404).send("User not found");
    }
  } catch (err) {
    console.log("err: ", err);
    return res.status(500).send();
  }
});
const googleSignIn = async (req, res) => {
  passport.authenticate("google-signin", function (error, user, info) {
    if (error) {
      return res.status(500).json({
        message: error || "Something happend",
        error: error.message || "Server error",
      });
    }

    req.logIn(user, function (error, data) {
      if (error) {
        return res.status(500).json({
          message: error || "Something happend",
          error: error.message || "Server error",
        });
      }
    });

    user.isAuthenticated = true;
    return res.json(user);
  })(req, res);
};
const googleSignUp = async (req, res) => {
  passport.authenticate("google-signup", function (error, user, info) {
    if (error) {
      return res.status(500).json({
        message: error || "Something happend",
        error: error.message || "Server error",
      });
    }
    req.logIn(user, function (error, data) {
      if (error) {
        return res.status(500).json({
          message: error || "Something happend",
          error: error.message || "Server error",
        });
      }
      return res.json(user);
    });
  })(req, res);
};
const registerUser = expressAsyncHandler(async (req, res, next) => {
  const { email, password, first_name = "", last_name = "" } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({ message: "User already exists" });
    }
    const user = new User({
      email,
      password,
      first_name,
      last_name,
    });
    const createdUser = await user.save();
    const token = await createdUser.generateAuthToken();
    return res.status(201).send({
      user: createdUser,
      token,
      message: "User created successfully",
    });
  } catch (err) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});
const forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).send({ message: "User does not exists" });
    }
    //send email code
    var smtp = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abhipatel7410@gmail.com",
        pass: "kqslfaxksyxcjhbd"
      }
    });
    let token = jwt.sign({ _id: userExists._id }, "REFRESH_TOKEN_SECRET_KEY", { expiresIn: '30m' })
    let mailList = {};
    (mailList.from = "abhipatel7410@gmail.com"),
      (mailList.to = email);
    mailList.subject = 'User password';
    mailList.html = `<h1>Click the below link for reset password.</h1>
    <a href=${process.env.CLIENT_URL}reset_password/${token}>Click here!</a>`;
    smtp.sendMail(mailList, function (error, response) {
      if (error) {
        return res.status(500).send({
          message: "Something went wrong",
        });
      } else {
        return res.status(200).send({
          message: "Email send success",
        });
      }
    });
  } catch (err) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});
const resetPassword = expressAsyncHandler(async (req, res, next) => {
  const { token, password } = req.body;
  try {
    jwt.verify(token, "REFRESH_TOKEN_SECRET_KEY", async function (err, decoded) {
      if (err || !decoded) {
        return res.status(400).json({ message: "Link has been expired." })
      } else {
        const update_data = await User.findOneAndUpdate({ _id: decoded._id }, { password });
        return res.status(200).json({ message: "Password changed successfully." })
      }
    });

  } catch (err) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

module.exports = {
  loginUser,
  googleSignIn,
  googleSignUp,
  registerUser,
  forgetPassword,
  resetPassword
};
