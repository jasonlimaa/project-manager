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
  addSkills() {}
  editSkills() {}
  acceptInviteInTeam() {}
  rejectInviteInTeam() {}
}

module.exports = {
  UserController: new UserController(),
};
