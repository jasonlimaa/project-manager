const path = require("path");
const { createUploadPath } = require("./functions");
const uploadfile = async (req, res, next) => {
  try {
    if (req.file || Object.keys(req.files).length == 0) throw { status: 400, message: "please select project image" };
    let image = req.files.image;
    const imageType = path.extname(image.name);
    if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(imageType))
      throw { status: 400, message: "image format not correct" };
    const imagePath = path.join(createUploadPath(), Date.now() + imageType);
    req.body.image = imagePath.substring(7);
    let uploadPath = path.join(__dirname, "..", "..", imagePath);
    image.mv(uploadPath, (err) => {
      if (err) throw { status: 500, message: "upload image not successful" };
      next();
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  uploadfile,
};
