const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  console.log("auth middleware");
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("token: ", token);
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
    const user = await User.findOne({
        _id:decoded._id,'tokens.token':token
    });
    if(!user){
        throw new Error();
    }
    req.user = user;
    next();
} catch (e) {
    res.status(401).send({
      error: "Please authenticate!",
    });
  }
  // next();
};
module.exports = auth;
