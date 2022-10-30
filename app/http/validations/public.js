const { param } = require("express-validator");

function mongoIDvalidator() {
  return [param("id").isMongoId().withMessage("sent ID is not valid")];
}

module.exports = {
  mongoIDvalidator,
};
