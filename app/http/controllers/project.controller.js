const { ProjectModel } = require("../../models/project");

class ProjectController {
  async createProject(req, res, next) {
    try {
      const { title, text, image, tags } = req.body;
      const owner = req.user._id;
      const result = await ProjectModel.create({ title, text, owner, image, tags });
      if (!result) throw { status: 400, message: "create project not success" };
      return res.status(201).json({
        status: 201,
        success: true,
        message: "project created successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  getAllProject(req, res, next) {
    try {
      const owner = req.user._id;
      const projects = await ProjectModel.find({ owner });
      return res.status(200).json({
        status: 200,
        success: true,
        projects,
      });
    } catch (error) {
      next(error);
    }
  }
  getProjectById() {}
  getAllProjectOfTeam() {}
  getProjectOfUser() {}
  updateProject() {}
  removeProject() {}
}

module.exports = {
  ProjectController: new ProjectController(),
};
