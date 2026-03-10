import { inviteMentorService } from "./users.service.js";

/* ======================================
   INVITE MENTOR
====================================== */

export const inviteMentor = async (req, res) => {
  try {
    const result = await inviteMentorService(req.body, req.user);

    return res.status(201).json({
      message: "Mentor invited successfully",
      data: result
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    });
  }
};