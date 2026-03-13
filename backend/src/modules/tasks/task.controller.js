import {
  createTaskService,
  getApplicationTasksService,
  updateTaskService,
  cancelTaskService,
  getTaskDetailsService
} from "./task.service.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import File  from "../../models/File.js";


/*
CREATE TASK
*/

export const createTaskController = async (req, res) => {

  try {

    let resourceFiles = [];

    if (req.files && req.files.length) {

      for (const file of req.files) {

        const uploaded = await uploadToCloudinary(file);

        const fileDoc = await File.create({
          url: uploaded.secure_url,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          uploadedBy: req.user._id
        });

        resourceFiles.push(fileDoc._id);

      }

    }

    const task = await createTaskService(req.user, {
      ...req.body,
      resourceFiles
    });

    res.status(201).json({
      success: true,
      data: task
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};


/*
GET TASKS FOR APPLICATION
*/
export const getApplicationTasksController = async (req, res) => {

  try {

    const tasks = await getApplicationTasksService(
      req.user,
      req.params.applicationId
    );

    res.json({
      success: true,
      data: tasks
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};


/*
UPDATE TASK STATUS
*/
export const updateTaskController = async (req, res) => {

  try {

    const task = await updateTaskService(
      req.user,
      req.params.taskId,
      req.body
    );

    res.json({
      success: true,
      data: task
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};


/*
CANCEL TASK
*/
export const cancelTaskController = async (req, res) => {

  try {

    const task = await cancelTaskService(
      req.user,
      req.params.taskId
    );

    res.json({
      success: true,
      message: "Task cancelled",
      data: task
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};


/*
GET TASK DETAILS
*/
export const getTaskDetailsController = async (req, res) => {

  try {

    const task = await getTaskDetailsService(
      req.user,
      req.params.taskId
    );

    res.json({
      success: true,
      data: task
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};