const { body } = require("express-validator");
const { UserModel } = require("../../models/user");
function registerValidator() {
  return [
    body("username").custom(async (value, ctx) => {
      if (value) {
        const usernameRegexp = /^[a-z]+[a-z0-9\_\.]{2,}/gi;
        if (usernameRegexp.test(value)) {
          const user = await UserModel.findOne({ username: value });
          if (user) throw "username is exist please choose another username";
          return true;
        }
        throw "username is not correct";
      } else {
        throw "username cannot be empty";
      }
    }),
    body("email")
      .isEmail()
      .withMessage("email not correct")
      .custom(async (value, ctx) => {
        if (value) {
          const user = await UserModel.findOne({ email: value });
          if (user) throw "email is exist please choose another username";
          return true;
        }
      }),
    body("mobile")
      .isMobilePhone("fa-IR")
      .withMessage("mobile not correct")
      .custom(async (value, ctx) => {
        if (value) {
          const user = await UserModel.findOne({ mobile: value });
          if (user) throw "mobile is exist please choose another username";
          return true;
        }
      }),
    body("password")
      .isLength({ min: 6, max: 16 })
      .withMessage("password must be at least 6 and utmost 16 characters")
      .custom((value, ctx) => {
        if (!value) throw "password cannot be empty";
        if (value !== ctx.req.body.confirm_password) throw "password and confirm password not matched";
        return true;
      }),
  ];
}
module.exports = {
  registerValidator,
};
