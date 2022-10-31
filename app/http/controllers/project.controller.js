const autoBind = require("auto-bind");
const { ProjectModel } = require("../../models/project");
const { createLinkForFiles } = require("../../modules/functions");

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
      let projects = await ProjectModel.find({ owner });
      projects = projects.map((project) => {
        project.image = createLinkForFiles(req, project.image);
        return project;
      });
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
    return project;
  }
  async getProjectById(req, res, next) {
    try {
      const owner = req.user._id;
      const projectID = req.params.id;
      const project = await this.findProject(projectID, owner);
      project.image = createLinkForFiles(req, project.image);
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

  async updateProject(req, res, next) {
    try {
      const projectID = req.params.id;
      const data = { ...req.body };
      Object.entries(data).forEach(([key, value]) => {
        if (!["title", "text", "tags"].includes(key)) delete data[key];
        if (["", " ", 0, null, undefined, NaN].includes(value)) delete data[key];
        if (key == "tags" && data["tags"].constructor == Array) {
          data["tags"] = data["tags"].filter((val) => {
            if (!["", " ", 0, null, undefined, NaN].includes(val)) return val;
          });
          if (data["tags"].length == 0) delete data["tags"];
        }
      });
      const updateResult = await ProjectModel.updateOne({ _id: projectID }, { $set: data });
      if (updateResult.modifiedCount == 0) throw { status: 400, message: "project not update" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "project updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProjectImage(req, res, next) {
    try {
      const { image } = req.body;
      const owner = req.user._id;
      const projectID = req.params.id;
      await this.findProject(projectID, owner);
      const updateResult = await ProjectModel.updateOne({ _id: projectID }, { $set: { image } });
      if (updateResult.modifiedCount == 0) throw { status: 400, message: "project not update" };
      return res.status(200).json({
        status: 200,
        success: true,
        message: "project updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }
  getAllProjectOfTeam() {}
  getProjectOfUser() {}
}

module.exports = {
  ProjectController: new ProjectController(),
};
