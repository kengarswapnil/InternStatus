import ProgressLog from "../../models/ProgressLog.js";
import TaskSubmission from "../../models/TaskSubmission.js";
import InternshipReport from "../../models/InternshipReport.js";
import Application from "../../models/Application.js";
import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

// ─────────────────────────────────────────────
function getWeekNumber(startDate, currentDate) {
  const diff = new Date(currentDate) - new Date(startDate);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.floor(days / 7) + 1;
}

// simple sanitize (basic but necessary)
const escapeHTML = (str = "") =>
  str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));

// ─────────────────────────────────────────────
// GENERATE REPORT (FINAL)
// ─────────────────────────────────────────────
export const generateInternshipReportService = async (applicationId) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // 1. VALIDATE APPLICATION
    const application = await Application.findById(applicationId)
      .populate("student mentor company")
      .session(session);

    if (!application) throw new Error("Application not found");

    if (application.status !== "completed") {
      throw new Error("Internship not completed yet");
    }

    // 2. CHECK EXISTING
    let report = await InternshipReport.findOne({ application: applicationId }).session(session);

    if (report?.isLocked) {
      throw new Error("Report already generated");
    }

    // 3. FETCH LOGS
    const logs = await ProgressLog.find({ application: applicationId })
      .populate("task")
      .sort({ logDate: 1 })
      .session(session);

    if (!logs.length) throw new Error("No progress logs found");

    const validLogs = logs.filter(l => l.task?._id);
    if (!validLogs.length) throw new Error("Invalid log data");

    const startDate = validLogs[0].logDate;

    // 4. SUBMISSIONS
    const submissions = await TaskSubmission.find({
      application: applicationId,
      status: "approved"
    }).session(session);

    const submissionMap = {};
    for (const s of submissions) {
      const key = s.task.toString();
      if (!submissionMap[key] || submissionMap[key].submittedAt < s.submittedAt) {
        submissionMap[key] = s;
      }
    }

    // 5. WEEK BUILD
    const weekMap = {};

    for (const log of validLogs) {
      const weekNumber = getWeekNumber(startDate, log.logDate);

      if (!weekMap[weekNumber]) {
        weekMap[weekNumber] = {
          weekNumber,
          startDate: log.logDate,
          endDate: log.logDate,
          tasks: []
        };
      }

      weekMap[weekNumber].endDate = log.logDate;

      const submission = submissionMap[log.task._id.toString()];

      weekMap[weekNumber].tasks.push({
        taskTitle: escapeHTML(log.task.title),
        summary: escapeHTML(log.summary),
        technologies: log.technologiesUsed || [],
        date: log.logDate,
        score: submission?.score || 0,
        mentorFeedback: escapeHTML(submission?.mentorFeedback || "")
      });
    }

    const weeks = Object.values(weekMap).sort((a, b) => a.weekNumber - b.weekNumber);

    // 6. METRICS
    const scores = weeks.flatMap(w => w.tasks.map(t => t.score)).filter(Boolean);

    const mentorScore =
      scores.length === 0 ? 0 : scores.reduce((a, b) => a + b, 0) / scores.length;

    const technologies = [
      ...new Set(weeks.flatMap(w => w.tasks.flatMap(t => t.technologies)))
    ];

    const totalTasks = weeks.reduce((acc, w) => acc + w.tasks.length, 0);

    // 7. HTML
   const html = `
<style>
  body { font-family: Arial; padding: 30px; line-height: 1.6; }
  h1 { text-align: center; margin-bottom: 20px; }
  h2 { margin-top: 20px; }
  .section { margin-bottom: 25px; }
  .task { margin-left: 20px; padding: 10px; border-left: 3px solid #555; margin-bottom: 10px; }
  .label { font-weight: bold; }
</style>

<h1>INTERNSHIP REPORT</h1>

<div class="section">
  <p><span class="label">Student:</span> ${application.student?.fullName}</p>
  <p><span class="label">Company:</span> ${application.company?.name}</p>
  <p><span class="label">Total Tasks:</span> ${totalTasks}</p>
  <p><span class="label">Mentor Score:</span> ${mentorScore.toFixed(2)}</p>
</div>

${weeks.map(w => `
  <div class="section">
    <h2>Week ${w.weekNumber}</h2>

    ${w.tasks.map((t, i) => `
      <div class="task">
        <p><span class="label">Task ${i + 1}: ${t.taskTitle}</span></p>
        <p><span class="label">Description:</span> ${t.summary}</p>
        <p><span class="label">Technologies:</span> ${t.technologies?.join(", ") || "-"}</p>
        <p><span class="label">Score:</span> ${t.score || 0}/10</p>
        <p><span class="label">Feedback:</span> ${t.mentorFeedback || "-"}</p>
      </div>
    `).join("")}

  </div>
`).join("")}
</div>
`;

    // 8. PDF GENERATION (SAFE)
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    // 9. UPLOAD
    const upload = await uploadToCloudinary(
      {
        buffer: pdfBuffer,
        mimetype: "application/pdf",
        originalname: `report-${applicationId}.pdf`
      },
      "internship_reports"
    );

    // 10. SAVE (SAFE)
    if (!report) {
      report = new InternshipReport({
        application: applicationId,
        student: application.student._id,
        mentor: application.mentor?._id,
        company: application.company._id,
        totalTasks,
        tasksCompleted: totalTasks,
        completionRate: 100,
        mentorScore,
        technologies,
        weeklyData: weeks,
        reportUrl: upload.secure_url,
        status: "generated",
        facultyStatus: "pending",
        isLocked: true
      });
    } else {
      Object.assign(report, {
        totalTasks,
        tasksCompleted: totalTasks,
        completionRate: 100,
        mentorScore,
        technologies,
        weeklyData: weeks,
        reportUrl: upload.secure_url,
        status: "generated",
        facultyStatus: "pending",
        isLocked: true
      });
    }

    await report.save({ session });

    await session.commitTransaction();
    session.endSession();

    return {
      message: "Report generated successfully",
      reportUrl: report.reportUrl
    };

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

// ─────────────────────────────────────────────
// GET REPORT (NO 404)
// ─────────────────────────────────────────────
export const getInternshipReportService = async (applicationId) => {
  return await InternshipReport.findOne({ application: applicationId });
};

// ─────────────────────────────────────────────
// SUBMIT
// ─────────────────────────────────────────────
export const submitInternshipReportService = async (applicationId) => {

  const report = await InternshipReport.findOne({ application: applicationId });

  if (!report) throw new Error("Generate report first");
  if (!report.isLocked) throw new Error("Report not finalized");
  if (report.status === "faculty_pending") throw new Error("Already submitted");

  report.status = "faculty_pending";
  report.facultyStatus = "pending";

  await report.save();

  return { message: "Submitted successfully" };
};

// ─────────────────────────────────────────────
// DOWNLOAD
// ─────────────────────────────────────────────
export const downloadReportService = async (applicationId) => {
  const report = await InternshipReport.findOne({ application: applicationId });

  if (!report?.reportUrl) throw new Error("Report not found");

  return report.reportUrl;
};

export const approveInternshipReportService = async (applicationId, facultyId) => {

  const report = await InternshipReport.findOne({ application: applicationId });

  if (!report) throw new Error("Report not found");

  if (report.status !== "faculty_pending") {
    throw new Error("Report is not pending for approval");
  }

  const application = await Application.findById(applicationId);

  if (!application) throw new Error("Application not found");

  // 🔥 AUTO ASSIGN IF NOT EXISTS
  if (!application.faculty) {
    application.faculty = facultyId;
    await application.save();
  }

  // 🔒 STRICT CHECK AFTER ASSIGNMENT
  if (application.faculty.toString() !== facultyId.toString()) {
    throw new Error("Unauthorized faculty");
  }

  report.status = "faculty_approved";
  report.facultyStatus = "approved";
  report.approvedAt = new Date();

  await report.save();

  return { message: "Report approved successfully" };
};