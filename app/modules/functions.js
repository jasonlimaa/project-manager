const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

function hashString(str) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(str, salt);
}
function tokenGenerator(payload) {
  // eslint-disable-next-line no-undef
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "3 days" });
  return token;
}
function verifyJwtToken(token) {
  // eslint-disable-next-line no-undef
  const result = jwt.verify(token, process.env.SECRET_KEY);
  if (!result?.username) throw { status: 401, message: "please login" };
  return result;
}
function createUploadPath() {
  let d = new Date();
  const year = "" + d.getFullYear();
  const month = "" + d.getMonth();
  const day = "" + d.getDate();
  const uploadPath = path.join(__dirname, "..", "..", "public", "upload", year, month, day);
  fs.mkdirSync(uploadPath, { recursive: true });
  return path.join("public", "upload", year, month, day);
}
module.exports = {
  hashString,
  tokenGenerator,
  verifyJwtToken,
  createUploadPath,
};
