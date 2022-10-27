const { body } = require("express-validator");
const path = require("path");
function imageValidator() {
  return [
    body("image").custom((image, { req }) => {
      if (Object.keys(req.file).length == 0) throw "please select an image";
      const ext = path.extname(req.file.originalname);
      const exts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
      if (!exts.includes(ext)) throw "upload format not correct";
      const maxSize = 2 * 1024 * 1024;
      if (req.file.size > maxSize) throw "max upload size is 2 Mb";
      return true;
    }),
  ];
}

module.exports = {
  imageValidator,
};
