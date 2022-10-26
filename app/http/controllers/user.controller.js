const { UserModel } = require("../../models/user");

class UserController {
  getProfile(req, res, next) {
    try {
      const user = req.user;
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
      const username = req.user.username;
      Object.entries(data).forEach(([key, value]) => {
        if (badValues.includes(value)) {
          delete data[key];
        }
        if (!fields.includes(key)) {
          delete data[key];
        }
      });
      const result = await UserModel.updateOne({ username }, { $set: data });
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
  addSkills() {}
  editSkills() {}
  acceptInviteInTeam() {}
  rejectInviteInTeam() {}
}

module.exports = {
  UserController: new UserController(),
};
