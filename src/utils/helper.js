const jwt = require("jsonwebtoken");

export const generateJwtToken = () => {
  const token = jwt.sign({ _id: userExists._id }, "somekeyhere00");
};
