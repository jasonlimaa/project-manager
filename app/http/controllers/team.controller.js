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
      const teams = await TeamModel.aggregate([
        {
          $match: {
            $or: [{ owner: userID }, { users: userID }],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $project: {
            "owner.teams": 0,
            "owner.skills": 0,
            "owner.roles": 0,
            "owner.password": 0,
            "owner.token": 0,
            "owner.__v": 0,
            "owner.profile_image": 0,
            "owner.createdAt": 0,
            "owner.updatedAt": 0,
            "owner.inviteRequests": 0,
          },
        },
        {
          $unwind: "$owner",
        },
      ]);
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
  async updateTeam(req, res, next) {
    try {
      const data = { ...req.body };
      Object.keys(data).forEach((key) => {
        if (!data[key]) delete data[key];
        if (["", " ", undefined, null, NaN].includes[data[key]]) delete data[key];
      });
      const userID = req.user._id;
      const { teamID } = req.params;
      const team = await TeamModel.findOne({ owner: userID, _id: teamID });
      if (!team) throw { status: 404, message: "team not found with this info" };
      const teamEditResult = await TeamModel.updateOne({ _id: teamID }, { $set: data });
      if (teamEditResult.modifiedCount == 0) throw { status: 500, message: "team not updated" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Team updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  removeUserFromTeam() {}
}
module.exports = {
  TeamController: new TeamController(),
};
