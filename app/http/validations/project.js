const { body } = require("express-validator");

function createProjectValidator() {
  return [
    body("title").notEmpty().withMessage("Title is required"),
    body("tags").isLength({ min: 0, max: 10 }).withMessage("max tags number is 10"),
    body("text").notEmpty().isLength({ min: 20 }).withMessage("at least 25 chars for text required"),
  ];
}
module.exports = {
  createProjectValidator,
};
