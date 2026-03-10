import College from "../../models/College.js";
import FacultyEmploymentHistory from "../../models/FacultyEmploymentHistory.js";
import FacultyProfile from "../../models/FacultyProfile.js";
import User from "../../models/User.js";
import createUserWithToken from "../../utils/createUser.js";

/* ======================================
   GET COURSES
====================================== */

export const getCoursesService = async (user) => {
  const collegeId = user.referenceId;

  const college = await College.findById(collegeId);

  if (!college) throw new Error("College not found");

  return college.courses;
};


/* ======================================
   ADD COURSE
====================================== */

export const addCourseService = async (user, body) => {

  const { name, durationYears, specializations } = body;

  if (!name || !durationYears) {
    throw new Error("Course name and duration required");
  }

  const collegeId = user.referenceId;

  const college = await College.findById(collegeId);

  if (!college) throw new Error("College not found");

  const exists = college.courses.find(
    c => c.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    throw new Error("Course already exists");
  }

  college.courses.push({
    name,
    durationYears,
    specializations: specializations || []
  });

  await college.save();

  return college.courses;
};


/* ======================================
   UPDATE COURSE
====================================== */

export const updateCourseService = async (
  user,
  courseName,
  body
) => {

  const collegeId = user.referenceId;

  const college = await College.findById(collegeId);

  if (!college) throw new Error("College not found");

  const course = college.courses.find(
    c => c.name === courseName
  );

  if (!course) throw new Error("Course not found");

  if (body.name) course.name = body.name;
  if (body.durationYears) course.durationYears = body.durationYears;
  if (body.specializations) course.specializations = body.specializations;

  await college.save();

  return college.courses;
};


/* ======================================
   DELETE COURSE
====================================== */

export const deleteCourseService = async (
  user,
  courseName
) => {

  const collegeId = user.referenceId;

  const college = await College.findById(collegeId);

  if (!college) throw new Error("College not found");

  college.courses = college.courses.filter(
    c => c.name !== courseName
  );

  await college.save();

  return college.courses;
};


export const getCollegeListService = async () => {

  const colleges = await College.find(
    { status: "active" },
    "_id name"
  ).sort({ name: 1 });

  return colleges;
};

// ================= GET PROFILE =================
export const getCollegeProfileService = async (user, collegeId) => {

  let id;

  if (user.role === "admin" && collegeId) {
    id = collegeId;               // admin viewing any
  } else {
    id = user.referenceId;        // college viewing own
  }

  const college = await College.findById(id);

  if (!college) {
    throw new Error("College not found");
  }

  return college;
};


// ================= UPDATE PROFILE =================
export const updateCollegeProfileService = async (
  user,
  body,
  collegeId
) => {

  let id;

  if (user.role === "admin" && collegeId) {
    id = collegeId;
  } else {
    id = user.referenceId;
  }

  const college = await College.findById(id);

  if (!college) {
    throw new Error("College not found");
  }


  // Editable fields
  const allowedFields = [
    "name",
    "website",
    "phone",
    "address",
    "description"
  ];

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      college[field] = body[field];
    }
  });

  await college.save();

  return college;
};


export const getCollegeFacultyService = async (user) => {
  const collegeId = user.referenceId;

  const faculty = await FacultyProfile.find({
    college: collegeId,
    status: "active"
  })
    .populate("user", "email")
    .lean();

  return faculty;
};

export const updateCollegeFacultyService = async (
  user,
  facultyId,
  body
) => {

  const collegeId = user.referenceId;

  const faculty = await FacultyProfile.findOne({
    _id: facultyId,
    college: collegeId
  });

  if (!faculty) {
    throw new Error("Faculty not found");
  }


  const allowedFields = [
    "courseName",
    "department",   // ✅ correct field
    "designation",
    "employeeId",
    "joiningYear"
  ];


  let academicChanged = false;


  allowedFields.forEach((field) => {

    if (body[field] !== undefined) {

      if (faculty[field] !== body[field]) {
        faculty[field] = body[field];

        if (["courseName", "specialization", "designation"].includes(field)) {
          academicChanged = true;
        }
      }
    }
  });


  await faculty.save();


  // =============================
  // UPDATE EMPLOYMENT HISTORY SNAPSHOT
  // =============================

  if (academicChanged) {

    await FacultyEmploymentHistory.updateOne(
      {
        faculty: facultyId,
        status: "active"
      },
      {
        courseName: faculty.courseName,
        specialization: faculty.department,
        designation: faculty.designation
      }
    );
  }


  return faculty;
};


export const removeFacultyFromCollegeService = async (
  user,
  facultyId
) => {

  const collegeId = user.referenceId;
  const adminId = user._id;

  const faculty = await FacultyProfile.findOne({
    _id: facultyId,
    college: collegeId
  });

  if (!faculty) {
    throw new Error("Faculty not found");
  }

  // =============================
  // END EMPLOYMENT HISTORY
  // =============================

  const history = await FacultyEmploymentHistory.findOne({
    faculty: facultyId,
    status: "active"
  });

  if (history) {
    history.endDate = new Date();
    history.status = "ended";
    history.endedBy = adminId;
    await history.save();
  }


  // =============================
  // CLEAR FACULTY DATA
  // =============================

  faculty.college = null;
  faculty.courseName = null;
  faculty.department = null;
  faculty.specialization = null;
  faculty.designation = null;
  faculty.employeeId = null;
  faculty.joiningYear = null;
  faculty.status = "unassigned";

  await faculty.save();


  // =============================
  // UPDATE USER (DISABLE LOGIN)
  // =============================

  const userDoc = await User.findById(faculty.user);

  if (userDoc) {

    userDoc.password = null;
    userDoc.isRegistered = false;
    userDoc.isVerified = false;

    // create fresh setup token
    const { rawToken } = await createUserWithToken({
      email: userDoc.email,
      role: "faculty",
      referenceModel: "FacultyProfile",
      createdBy: adminId
    });

    userDoc.passwordSetupToken =
      userDoc.passwordSetupToken; // already set by util

    await userDoc.save();
  }

  return { success: true };
};