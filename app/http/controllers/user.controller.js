const { UserModel } = require("../../models/user");
const { createLinkForFiles } = require("../../modules/functions");

class UserController {
  getProfile(req, res, next) {
    try {
      const user = req.user;
      user.profile_image = createLinkForFiles(req, user.profile_image);
      return res.status(200).json({
        status: 200,
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }
  async editProfile(req, res, next) {
    try {
      let data = { ...req.body };
      const fields = ["first_name", "last_name", "skills"];
      const badValues = ["", " ", ".", null, undefined, 0, -1, NaN, [], {}];
      const userID = req.user._id;
      Object.entries(data).forEach(([key, value]) => {
        if (badValues.includes(value)) {
          delete data[key];
        }
        if (!fields.includes(key)) {
          delete data[key];
        }
      });
      const result = await UserModel.updateOne({ _id: userID }, { $set: data });
      if (result.modifiedCount > 0) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: "profile updated successfully",
        });
      }
      throw { status: 400, message: "updated not success" };
    } catch (error) {
      next(error);
    }
  }
  async uploadProfileImage(req, res, next) {
    try {
      const userID = req.user._id;
      const filePath = req.file.path.substring(7);
      const result = await UserModel.updateOne({ _id: userID }, { $set: { profile_image: filePath } });
      if (result.modifiedCount == 0) return { status: 400, message: "updated not success" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "profile image updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllRequests(req, res, next) {
    try {
      const userID = req.user._id;
      const inviteRequests = await UserModel.aggregate([
        {
          $match: { _id: userID },
        },
        { $unwind: "$inviteRequests" },
        {
          $lookup: {
            from: "users",
            localField: "inviteRequests.caller",
            foreignField: "username",
            as: "caller",
          },
        },
        {
          $project: {
            teamID: "$inviteRequests.teamID",
            status: "$inviteRequests.status",
            caller: {
              username: "$caller.username",
              mobile: "$caller.mobile",
              email: "$caller.email",
            },
          },
        },
        { $unwind: "$caller" },
        { $unwind: "$caller.username" },
        { $unwind: "$caller.mobile" },
        { $unwind: "$caller.email" },
      ]);
      
      // const { inviteRequests } = await UserModel.findById(userID, { inviteRequests: 1 });
      return res.json({
        inviteRequests,
      });
    } catch (error) {
      next(error);
    }
  }
  async geRequestsByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const userID = req.user._id;
      const requests = await UserModel.aggregate([
        {
          $match: { _id: userID },
        },
        {
          $project: {
            _id: 0,
            inviteRequests: {
              $filter: {
                input: "$inviteRequests",
                as: "request",
                cond: {
                  $eq: ["$$request.status", status],
                },
              },
            },
          },
        },
      ]);
      return res.status(200).json({
        status: 200,
        success: true,
        requests: requests[0]?.inviteRequests || [],
      });
    } catch (error) {
      next(error);
    }
  }

  addSkills() {}
  editSkills() {}
  async changeStatusRequest(req, res, next) {
    try {
      const { id, status } = req.params;
      const request = await UserModel.findOne({ "inviteRequests._id": id });
      if (!request) throw { status: 404, message: "request not found" };
      const findRequest = request.inviteRequests.find((item) => item.id == id);
      if (findRequest.status != "pending") throw { status: 400, message: "can`t change status" };
      if (!["accepted", "rejected"].includes(status)) throw { status: 400, message: "entered information not correct" };
      const updateResult = await UserModel.updateOne(
        { "inviteRequests._id": id },
        {
          $set: { "inviteRequests.$.status": status },
        }
      );
      if (updateResult.modifiedCount == 0) throw { status: 500, message: "change status to work" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "change status successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  rejectInviteInTeam() {}
}

module.exports = {
  UserController: new UserController(),
};
