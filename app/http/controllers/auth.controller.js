const { UserModel } = require("../../models/user");
const { hashString, tokenGenerator } = require("../../modules/functions");
const bcrypt = require("bcrypt");
class AuthController {
  async register(req, res, next) {
    try {
      const { username, password, email, mobile } = req.body;
      const hash_password = hashString(password);
      const user = await UserModel.create({
        username,
        email,
        password: hash_password,
        mobile,
      });
      return res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
      if (!user) throw { status: 401, message: "username or password not correct" };
      const compareRsult = bcrypt.compareSync(password, user.password);
      if (!compareRsult) throw { status: 401, message: "username or password not correct" };
      const token = tokenGenerator({ username });
      user.token = token;
      user.save();
      return res.status(200).json({
        status: 200,
        success: true,
        message: "login successful",
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  resetPassword() {}
}
module.exports = {
  AuthController: new AuthController(),
};
