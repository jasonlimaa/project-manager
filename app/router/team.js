const router = require("express").Router();
const { checkLogin } = require("../http/middlewares/autoLogin");
const { TeamController } = require("../http/controllers/team.controller");
const { createTeamValidator } = require("../http/validations/team");
const { expressValidatorMapper } = require("../http/middlewares/checkErrors");
const { mongoIDvalidator } = require("../http/validations/public");

router.post("/create", checkLogin, createTeamValidator(), expressValidatorMapper, TeamController.createTeam);
router.get("/list", checkLogin, TeamController.getListTeam);
router.get("/me", checkLogin, TeamController.getMyTeams);
router.get("/invite/:teamID/:username", checkLogin, TeamController.inviteUserToTeam);
router.put("/update/:teamID", checkLogin, TeamController.updateTeam);
router.get("/:id", checkLogin, mongoIDvalidator(), expressValidatorMapper, TeamController.getTeamByID);
router.delete("/remove/:id", checkLogin, mongoIDvalidator(), expressValidatorMapper, TeamController.removeTeamByID);
module.exports = {
  teamRoutes: router,
};
