const { TeamModel } = require("../../models/team");
class TeamController {
  async createTeam(req, res, next) {
    try {
      const { name, description, username } = req.body;
      console.log(name, description, username);
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
  inviteUserToTeam() {}
  removeTeam() {}
  updateTeam() {}
  removeUserFromTeam() {}
}
module.exports = {
  TeamController: new TeamController(),
};
