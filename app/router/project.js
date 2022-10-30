const fileUpload = require("express-fileupload");
const { ProjectController } = require("../http/controllers/project.controller");
const { checkLogin } = require("../http/middlewares/autoLogin");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { createProjectValidator } = require("../http/validations/project");
const { mongoIDvalidator } = require("../http/validations/public");
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
router.post("/list", checkLogin, ProjectController.getAllProject);
router.post("/:id", checkLogin, mongoIDvalidator(), expressValidatorMapper, ProjectController.getProjectById);
router.post("/remove/:id", checkLogin, mongoIDvalidator(), expressValidatorMapper, ProjectController.removeProject);
router.post("/edit/:id", checkLogin, mongoIDvalidator(), expressValidatorMapper, ProjectController.createProject);
module.exports = {
  projectRoutes: router,
};
