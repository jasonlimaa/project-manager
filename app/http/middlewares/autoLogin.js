const { UserModel } = require("../../models/user");
const { verifyJwtToken } = require("../../modules/functions");

const checkLogin = async (req, res, next) => {
  try {
    const authorization = req?.headers?.authorization;
    const authError = "please login again";
    if (!authorization) throw { status: 401, message: authError };
    let token = authorization.split(" ")?.[1];
    if (!token) throw { status: 401, message: authError };
    const result = verifyJwtToken(token);
    const { username } = result;
    const user = await UserModel.findOne({ username }, { password: 0, __v: 0, _id: 0 });
    if (!user) throw { status: 401, message: authError };
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  checkLogin,
};
