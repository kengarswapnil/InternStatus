import {
  getFacultyStudentsService,
  updateFacultyStudentService
} from "./faculty.student.service.js";

export const getFacultyStudents = async (req, res) => {

  const data = await getFacultyStudentsService(req.user);

  res.json({ data });
};



export const updateFacultyStudent = async (req, res) => {

  const data = await updateFacultyStudentService(
    req.user,
    req.params.studentId,
    req.body
  );

  res.json({
    message: "Student updated",
    data
  });
};