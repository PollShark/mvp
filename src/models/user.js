const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      // required: true,
    },
    last_name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default:''
      //required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    googleId: String,
    tokens:[{
      token:{
        type:String,
        required:true,
      }
    }]
  },
  {
    timestamps: true,
  }
);
userSchema.virtual("surveys", {
  ref: "Survey",
  localField: "_id",
  foreignField: "owner",
  });
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.googleId;
  return userObject;
  };
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
module.exports = User;
