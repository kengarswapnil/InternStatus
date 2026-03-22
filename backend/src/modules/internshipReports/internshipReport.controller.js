import {
  generateInternshipReportService,
  submitInternshipReportService,
  getInternshipReportService,
  downloadReportService,
  approveInternshipReportService
} from "./internshipReport.service.js";

// GENERATE
export const generateReport = async (req, res) => {
  try {
    const data = await generateInternshipReportService(req.params.applicationId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// GET (🔥 FIXED — NO 404 EVER)
export const getReport = async (req, res) => {
  try {
    const report = await getInternshipReportService(req.params.applicationId);

    // ALWAYS return 200
    return res.status(200).json(report || null);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// SUBMIT
export const submitReport = async (req, res) => {
  try {
    const data = await submitInternshipReportService(req.params.applicationId);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// DOWNLOAD
export const download = async (req, res) => {
  try {
    const url = await downloadReportService(req.params.applicationId);
    return res.status(200).json({ url });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};


export const approveReport = async (req, res) => {
  try {
    const facultyId = req.user.id; // from auth middleware

    const data = await approveInternshipReportService(
      req.params.applicationId,
      facultyId
    );

    return res.status(200).json(data);

  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
};