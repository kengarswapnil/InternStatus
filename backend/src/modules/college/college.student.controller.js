import FacultyProfile from "../../models/FacultyProfile.js";
import {
  getCollegeStudentsService,
  updateCollegeStudentService,
  removeStudentFromCollegeService,
   searchStudentService,
  getStudentReportsService,
  assignCreditsService,
    getAtRiskStudentsService,
  getAtRiskStudentByIdService,
  notifyAtRiskStudentService
} from "./college.student.service.js";


export const getCollegeStudents = async (req, res) => {

  const data = await getCollegeStudentsService(req.user);

  res.json({ data });
};



export const updateCollegeStudent = async (req, res) => {

  const data = await updateCollegeStudentService(
    req.user,
    req.params.studentId,
    req.body
  );

  res.json({
    message: "Student updated",
    data
  });
};



export const removeStudentFromCollege = async (req, res) => {

  await removeStudentFromCollegeService(
    req.user,
    req.params.studentId
  );

  res.json({
    message: "Student removed from college"
  });
};

/*
  ================= SEARCH =================
*/
export const searchStudent = async (req, res) => {
  try {

    const { query } = req.query;

    const data = await searchStudentService(query, req.user);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


/*
  ================= GET REPORTS =================
*/
export const getStudentReports = async (req, res) => {
  try {

    const { studentId } = req.params;

    const data = await getStudentReportsService(
  req.params.studentId,
  req.user   // 🔥 THIS WAS MISSING
);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};


/*
  ================= ASSIGN CREDITS =================
*/
export const assignCredits = async (req, res) => {
  try {

    const { reportId } = req.params;
    const { facultyScore, remarks } = req.body;

    const data = await assignCreditsService({
      reportId,
      facultyScore,
      remarks,
      user: req.user
    });

    res.json({
      success: true,
      message: "Credits assigned successfully",
      data
    });

  } catch (err) {

    const statusCode =
      err.message.includes("Unauthorized") ? 403 :
      err.message.includes("not found") ? 404 :
      400;

    res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }
};



export const getAtRiskStudents = async (req, res) => {
  try {
    let collegeId;

    // ✅ CASE 1: College user
    if (req.user.role === "college") {
      collegeId = req.user.referenceId;
    }

    // ✅ CASE 2: Faculty user
    else if (req.user.role === "faculty") {
      const faculty = await FacultyProfile.findById(
        req.user.referenceId
      ).select("college");

      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: "Faculty not found"
        });
      }

      collegeId = faculty.college;
    }

    // ❌ anything else → reject
    else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role"
      });
    }

    const { search = "", page = 1, limit = 10 } = req.query;

    const data = await getAtRiskStudentsService({
      collegeId,
      search,
      page: Number(page),
      limit: Number(limit)
    });

    return res.json({
      success: true,
      ...data
    });

  } catch (err) {
    console.error("getAtRiskStudents:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// ---------------- GET ONE ----------------
export const getAtRiskStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await getAtRiskStudentByIdService(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not at risk or not found"
      });
    }

    return res.json({
      success: true,
      data: student
    });
  } catch (err) {
    console.error("getAtRiskStudentById:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const notifyAtRiskStudent = async (req, res) => {
  try {
    const { studentId, message } = req.body;

    if (!studentId || !message) {
      return res.status(400).json({
        success: false,
        message: "studentId and message are required"
      });
    }

    // ✅ PASS USER (THIS WAS YOUR BUG)
    const result = await notifyAtRiskStudentService({
      studentId,
      message,
      user: req.user
    });

    return res.json({
      success: true,
      message: "Notification sent successfully",
      data: result
    });

  } catch (err) {
    console.error("notifyAtRiskStudent:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};