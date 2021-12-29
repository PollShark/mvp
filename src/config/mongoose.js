console.log('HELLLLLLLLLOOOOOOOOOOOOO');
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const uri =
  "mongodb+srv://suppi00:suppi0098@cluster0.ltzyp.mongodb.net/survey-app?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
mongoose
  .connect(uri,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true,
    // useFindAndModify:false,
  })
  .then((result) => {
    console.log("connected successfully");
  })
  .catch((err) => {
    console.log("err: No Connection",err);
  });
