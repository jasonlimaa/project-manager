const path = require("path");
const { createUploadPath } = require("./functions");
const uploadfile = async (req, res, next) => {
  try {
    if (req.file || Object.keys(req.files).length == 0) throw { status: 400, message: "please select project image" };
    let image = req.files.image;
    const imagePath = path.join(createUploadPath(), Date.now() + path.extname(image.name));
    req.body.image = imagePath;
    let uploadPath = path.join(__dirname, "..", "..", imagePath);
    console.log(uploadPath);
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
