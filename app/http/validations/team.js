const { body, param } = require("express-validator");
const { TeamModel } = require("../../models/team");

function createTeamValidator() {
  return [
    body("name").isLength({ min: 5 }).withMessage("name must be at least 5 characters"),
    body("description").notEmpty().withMessage("description cannot be empty"),
    body("username").custom(async (username) => {
      const usernameRegexp = /^[a-z]+[a-z0-9\_\.]{3,}$/gim;
      if (usernameRegexp.test(username)) {
        const team = await TeamModel.findOne({ username });
        if (team) throw "username is exist";
        return true;
      }
      throw "please enter a valid username";
    }),
  ];
}
function inviteToTeam() {
    
}
module.exports = {
  createTeamValidator,
  inviteToTeam
};
