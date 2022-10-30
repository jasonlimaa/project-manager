const autoBind = require("auto-bind");
const { ProjectModel } = require("../../models/project");

class ProjectController {
  constructor() {
    autoBind(this);
  }
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
  async getAllProject(req, res, next) {
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
  async findProject(projectID, owner) {
    const project = await ProjectModel.findOne({ _id: projectID, owner });
    if (!project) throw { status: 404, message: "project not found" };
    console.log(project);
    return project;
  }
  async getProjectById(req, res, next) {
    try {
      const owner = req.user._id;
      const projectID = req.params.id;
      const project = await this.findProject(projectID, owner);
      return res.status(200).json({
        status: 200,
        success: true,
        project,
      });
    } catch (error) {
      next(error);
    }
  }
  async removeProject(req, res, next) {
    try {
      const owner = req.user._id;
      const projectID = req.params.id;
      await this.findProject(projectID, owner);
      const deleteProjectResult = await ProjectModel.deleteOne({ _id: projectID });
      if (deleteProjectResult.deletedCount == 0) throw { status: 400, message: "project not delete" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "project deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  getAllProjectOfTeam() {}
  getProjectOfUser() {}
  updateProject() {}
}

module.exports = {
  ProjectController: new ProjectController(),
};
