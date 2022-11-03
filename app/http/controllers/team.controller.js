const autoBind = require("auto-bind");
const { TeamModel } = require("../../models/team");
const { UserModel } = require("../../models/user");
class TeamController {
  constructor() {
    autoBind(this);
  }
  async createTeam(req, res, next) {
    try {
      const { name, description, username } = req.body;
      const owner = req.user._id;
      const team = await TeamModel.create({
        name,
        description,
        username,
        owner,
      });
      if (!team) throw { status: 500, message: "team not created" };
      return res.status(201).json({
        status: 201,
        success: true,
        message: "created team successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async getListTeam(req, res, next) {
    try {
      const teams = await TeamModel.find({});
      return res.status(200).json({
        status: 200,
        success: true,
        teams,
      });
    } catch (error) {
      next(error);
    }
  }
  async getTeamByID(req, res, next) {
    try {
      const { id: teamID } = req.params;
      const team = await TeamModel.findOne({ _id: teamID });
      if (!team) throw { status: 404, message: "team not found" };
      return res.status(200).json({
        status: 200,
        success: true,
        team,
      });
    } catch (error) {
      next(error);
    }
  }
  async removeTeamByID(req, res, next) {
    try {
      const { id: teamID } = req.params;
      const team = await TeamModel.findOne({ _id: teamID });
      if (!team) throw { status: 404, message: "team not found" };
      const removeResult = await TeamModel.deleteOne({ _id: teamID });
      if (removeResult.deletedCount == 0) throw { status: 500, message: "Remove Team unsuccess" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Remove team successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async getMyTeams(req, res, next) {
    try {
      const userID = req.user._id;
      const teams = await TeamModel.find({
        $or: [{ owner: userID }, { users: userID }],
      });
      return res.status(200).json({
        status: 200,
        success: true,
        teams,
      });
    } catch (error) {
      next(error);
    }
  }
  async findUserInTeam(userID, teamID) {
    const result = await TeamModel.findOne({ $or: [{ owner: userID }, { users: userID }], _id: teamID });
    return !!result;
  }
  async inviteUserToTeam(req, res, next) {
    try {
      const userID = req.user._id;
      const { username, teamID } = req.params;
      console.log(username, teamID);
      const team = await this.findUserInTeam(userID, teamID);
      if (!team) throw { status: 400, message: "team not found for invited" };
      const user = await UserModel.findOne({ username });
      if (!user) throw { status: 400, message: "user not found for invited" };
      const userInvited = await this.findUserInTeam(user._id, teamID);
      if (userInvited) throw { status: 400, message: "user currently exist in this team" };
      const request = {
        caller: req.user.username,
        requestDate: new Date(),
        teamID,
        status: "pending",
      };
      const updateUserResult = await UserModel.updateOne(
        { username },
        {
          $push: { inviteRequests: [request] },
        }
      );
      if (updateUserResult.modifiedCount == 0) throw { status: 500, message: "invite not success" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "invite user successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  removeTeam() {}
  updateTeam() {}
  removeUserFromTeam() {}
}
module.exports = {
  TeamController: new TeamController(),
};
