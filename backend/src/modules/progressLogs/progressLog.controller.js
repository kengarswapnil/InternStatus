import { getInternshipProgressService } from "./progressLog.service.js";

export const getInternshipProgress = async (req, res) => {

  try {

    const { applicationId } = req.params;

    const progress = await getInternshipProgressService(
      req.user,
      applicationId
    );

    res.status(200).json({
      success: true,
      data: progress
    });

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};