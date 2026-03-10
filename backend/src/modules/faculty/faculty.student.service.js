import StudentProfile from "../../models/StudentProfile.js";


// ======================================
// GET FACULTY STUDENTS
// ======================================

export const getFacultyStudentsService = async (user) => {

  const facultyId = user.referenceId;

  const FacultyProfile = StudentProfile.db.model("FacultyProfile");

  const facultyProfile = await FacultyProfile.findById(facultyId);

  if (!facultyProfile) {
    throw new Error("Faculty profile not found");
  }

  const students = await StudentProfile.find({
    college: facultyProfile.college,
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



// ======================================
// UPDATE STUDENT BY FACULTY
// ======================================

export const updateFacultyStudentService = async (
  user,
  studentId,
  body
) => {

  const facultyId = user.referenceId;

  const FacultyProfile = StudentProfile.db.model("FacultyProfile");

  const facultyProfile = await FacultyProfile.findById(facultyId);

  if (!facultyProfile) {
    throw new Error("Faculty profile not found");
  }

  // Ensure student belongs to same college
  const student = await StudentProfile.findOne({
    _id: studentId,
    college: facultyProfile.college
  });

  if (!student) {
    throw new Error("Student not found in your college");
  }

  // Academic fields
  const academicFields = [
    "courseName",
    "specialization",
    "courseStartYear",
    "courseEndYear",
    "Year",
    "status"
  ];

  academicFields.forEach(field => {
    if (body[field] !== undefined) {
      student[field] = body[field];
    }
  });

  // PRN correction allowed
  if (body.prn !== undefined) {
    student.prn = body.prn;
  }

  // ABC correction allowed with validation
  if (body.abcId !== undefined) {

    if (!/^\d{12}$/.test(body.abcId)) {
      throw new Error("ABC ID must be 12 digits");
    }

    student.abcId = body.abcId;
  }

  await student.save();

  return student;
};