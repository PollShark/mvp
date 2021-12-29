var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser")
var logger = require("morgan");
require("dotenv").config();
var authRouter = require("../src/routes/auth");
var surveyRouter = require("../src/routes/survey");
require("./config/mongoose");
var session = require("express-session");
var cors = require("cors");
const passport = require("passport");
require("./config/passport");
// var cors = require('cors');
var app = express();

app.use(
  cors({
    exposedHeaders: ["Link"]
  })
);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(path.resolve(__dirname, '../build')));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

//==============
app.use(session({ secret: "SECRET" }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter, surveyRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

var port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("App.js is running at port 5000");
});
module.exports = app;
