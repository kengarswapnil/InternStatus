import StudentProfile from "../../models/StudentProfile.js";

export const getFacultyStudentsService = async (user) => {

  const facultyId = user.referenceId;

  const FacultyProfile = StudentProfile.db.model("FacultyProfile");

  const faculty = await FacultyProfile.findById(facultyId);

  if (!faculty) throw new Error("Faculty profile not found");

  const students = await StudentProfile.find({
    college: faculty.college,
    status: "active"
  })
    .select(`
      fullName
      prn
      abcId
      courseName
      specialization
      courseStartYear
      courseEndYear
      Year
      status
    `)
    .populate("user", "email")
    .lean();

  return students;
};



export const updateFacultyStudentService = async (
  user,
  studentId,
  body
) => {

  const facultyId = user.referenceId;

  const FacultyProfile = StudentProfile.db.model("FacultyProfile");

  const faculty = await FacultyProfile.findById(facultyId);

  if (!faculty) throw new Error("Faculty profile not found");

  const student = await StudentProfile.findOne({
    _id: studentId,
    college: faculty.college
  });

  if (!student) throw new Error("Student not found in your college");

  const fields = [
    "courseName",
    "specialization",
    "courseStartYear",
    "courseEndYear",
    "Year",
    "status"
  ];

  fields.forEach((f) => {
    if (body[f] !== undefined) {
      student[f] = body[f];
    }
  });

  if (body.prn !== undefined) {
    student.prn = body.prn;
  }

  if (body.abcId !== undefined) {

    if (!/^\d{12}$/.test(body.abcId)) {
      throw new Error("ABC ID must be 12 digits");
    }

    student.abcId = body.abcId;
  }

  await student.save();

  return student;
};