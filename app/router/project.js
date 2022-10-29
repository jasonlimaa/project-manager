const fileUpload = require("express-fileupload");
const { ProjectController } = require("../http/controllers/project.controller");
const { checkLogin } = require("../http/middlewares/autoLogin");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { createProjectValidator } = require("../http/validations/project");
const { uploadfile } = require("../modules/express-fileupload");

const router = require("express").Router();
router.post(
  "/create",
  fileUpload(),
  checkLogin,
  uploadfile,
  createProjectValidator(),
  expressValidatorMapper,
  ProjectController.createProject
);
module.exports = {
  projectRoutes: router,
};
