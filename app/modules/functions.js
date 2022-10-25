const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
function hashString(str) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(str, salt);
}
function tokenGenerator(payload) {
  // eslint-disable-next-line no-undef
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "3 days" });
  return token;
}
module.exports = {
  hashString,
  tokenGenerator,
};
