import {
  getCollegeStudentsService,
  updateCollegeStudentService,
  removeStudentFromCollegeService
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